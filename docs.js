'use strict';

const express = require('express');
const upload = require('multer')();
const fs = require('fs');
const mustache = require('mustache');
const Path = require('path');
const {URL} = require('url');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, base, model) {
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  process.chdir(__dirname);
  app.use(base, express.static(STATIC_DIR));
  setupTemplates(app, TEMPLATES_DIR);
  setupRoutes(app);
  app.listen(port, function () {
    console.log(`listening on port ${port}`);
  });
}


module.exports = serve;

/******************************** Routes *******************************/

function setupRoutes(app) {
  //@TODO add appropriate routes

  const base = app.locals.base;
  app.get(`/`, redirectToHomePage(app));
  app.get(`${base}/`, getHomePage(app));
  app.get(`${base}/index.html`, getHomePage(app));

  app.get(`${base}/add.html`, getAddDocumentPage(app));
  app.post(`${base}/add`, upload.single('file'), postAddDocument(app));

  app.get(`${base}/search.html`, getSearch(app));
  app.get(`${base}/search`, getSearch(app, true));

  app.get(`${base}/:id`, getDocument(app)); //must be last
}

/*************************** Action Routines ***************************/

//@TODO add action routines for routes + any auxiliary functions.
function redirectToHomePage(app) {
  return async function (req, res) {
    res.redirect(`${app.locals.base}/`);
  };
}

function getHomePage(app) {
  return async function (req, res) {
    const model = {base: app.locals.base};
    const html = doMustache(app, 'home', model);
    res.send(html);
  };
}

function getAddDocumentPage(app) {
  return async function (req, res) {
    const model = {base: app.locals.base};
    const html = doMustache(app, 'add', model);
    res.send(html);
  };
}

function postAddDocument(app) {
  return async function (req, res) {
    try {
      let oUploadedFile = req.file;
      if (!oUploadedFile) {
        throw {message: "Please select a file containing a document to upload!!!"};
      }
      let buffer = oUploadedFile.buffer;
      let sContent = buffer.toString();

      let sFileName = oUploadedFile.originalname;
      if (sFileName.endsWith('.txt')) {
        sFileName = sFileName.replace(/\.[^/.]+$/, ""); //filename without extension.
      }

      let oDocBody = {
        name: sFileName,
        content: sContent
      }
      let oDocData = await app.locals.model.addDocument(oDocBody);
      res.redirect(`${app.locals.base}/${sFileName}`);

    } catch (e) {
      const oModel = {base: app.locals.base};
      let sErrorMessage = e.message || "Something went wrong. Please try again later.";
      oModel.errorMessage = sErrorMessage.charAt(0).toUpperCase() + sErrorMessage.slice(1);
      const html = doMustache(app, 'add', oModel);
      res.send(html);
    }

  };
}

function getSearch(app, bIsFormSubmission) {
  return async function (req, res) {
    let sBase = app.locals.base;
    let oModel = {};
    oModel.base = sBase;
    oModel.nothingToShow = "Nothing To Show";
    oModel.inputValue = "";

    if (bIsFormSubmission) {
      try {
        let sSearchQuery = req.query.q;
        if (!!sSearchQuery) {
          delete oModel.nothingToShow;
          oModel.inputValue = sSearchQuery;
          let oQuery = {
            q: sSearchQuery.replace(" ", "%20"),
            start: Number(req.query.start),
            count: 5
          }
          let oSearchResult = await app.locals.model.searchTerms(oQuery);

          if (oSearchResult.results.length) {
            let aList = [];
            oSearchResult.results.forEach(function (oEl) {
              let aSearchTerms = sSearchQuery.split(/\s+/);
              let aLines = _getSearchTermHighlightedLines(oEl.lines, aSearchTerms);
              aList.push({
                name: oEl.name,
                lines: aLines,
                href: `${oModel.base}/${oEl.name}`
              })
            });
            oModel.list = aList;

          } else {
            delete oModel.nothingToShow;
            oModel.errorMessage = `No document containing '${sSearchQuery}' found; Please retry!!!`;
          }

          if (oSearchResult.links.length) {
            oSearchResult.links.forEach(function (oLinkData) {
              if (oLinkData.rel !== "self") {
                oModel[oLinkData.rel] = oLinkData;
              }
            })
          }

        } else if (!sSearchQuery) {
          delete oModel.nothingToShow;
          oModel.errorMessage = "Please specify one-or-more search terms.";
        }

      }
      catch (e) {
        delete oModel.nothingToShow;
        let sErrorMessage = e.message || "Something went wrong. Please try again later.";
        oModel.errorMessage = sErrorMessage.charAt(0).toUpperCase() + sErrorMessage.slice(1);
      }
    }


    const html = doMustache(app, 'search', oModel);
    res.send(html);
  };
}

function getDocument(app) {
  return async function (req, res) {
    let sFileName = req.params.id;
    let oModel = {
      base: app.locals.base,
      name: sFileName,
    };

    try {
      let oDocData = await app.locals.model.getDocument(sFileName);
      oModel.content = oDocData.content;

    } catch (e) {
      delete oModel.nothingToShow;
      let sErrorMessage = e.message || "Something went wrong. Please try again later.";
      oModel.errorMessage = sErrorMessage.charAt(0).toUpperCase() + sErrorMessage.slice(1);
    }

    const html = doMustache(app, 'doccontent', oModel);
    res.send(html);
  };
}


/************************ General Utilities ****************************/

/** return object containing all non-empty values from object values */
function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function (k) {
    const v = values[k];
    if (v && v.trim().length > 0) out[k] = v.trim();
  });
  return out;
}


/** Return a URL relative to req.originalUrl.  Returned URL path
 *  determined by path (which is absolute if starting with /). For
 *  example, specifying path as ../search.html will return a URL which
 *  is a sibling of the current document.  Object queryParams are
 *  encoded into the result's query-string and hash is set up as a
 *  fragment identifier for the result.
 */
function relativeUrl(req, path = '', queryParams = {}, hash = '') {
  const url = new URL('http://dummy.com');
  url.protocol = req.protocol;
  url.hostname = req.hostname;
  url.port = req.socket.address().port;
  url.pathname = req.originalUrl.replace(/(\?.*)?$/, '');
  if (path.startsWith('/')) {
    url.pathname = path;
  }
  else if (path) {
    url.pathname += `/${path}`;
  }
  url.search = '';
  Object.entries(queryParams).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });
  url.hash = hash;
  return url.toString();
}

/************************** Template Utilities *************************/


/** Return result of mixing view-model view into template templateId
 *  in app templates.
 */
function doMustache(app, templateId, view) {
  let templates = (templateId !== "home") ? {navigator: app.templates.navigator} : {};
  return mustache.render(app.templates[templateId], view, templates);
}

/** Add contents all dir/*.ms files to app templates with each
 *  template being keyed by the basename (sans extensions) of
 *  its file basename.
 */
function setupTemplates(app, dir) {
  app.templates = {};
  for (let fname of fs.readdirSync(dir)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] = String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}

function _getSearchTermHighlightedLines(aLines, aTerm) {
  let aTemp = aLines;
  let iSearchTermIndex = 0;
  while (iSearchTermIndex < aTerm.length) {
    aTemp = _getSearchTermHighlightedLines2(aTemp, aTerm[iSearchTermIndex]);
    iSearchTermIndex++;
  }

  return aTemp;
}

function _getSearchTermHighlightedLines2(aLines, sTerm) {
  let aUpdated = [];
  aLines.forEach(function (sLine) {
    let simpleText = new RegExp(`(${sTerm})`, "gi");
    let sHighlighted = `<span class='search-term'>$1</span>`;
    let sNewLine = sLine.replace(simpleText, sHighlighted);
    aUpdated.push(sNewLine);
  });

  return aUpdated;
}