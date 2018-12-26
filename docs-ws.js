'use strict';

const axios = require('axios');


function DocsWs(baseUrl) {
  this.docsUrl = `${baseUrl}/docs`;
}

module.exports = DocsWs;

//@TODO add wrappers to call remote web services.

DocsWs.prototype.getDocument = async function(sDocName) {
  try {
    const url = this.docsUrl + `/${sDocName}`;
    const response = await axios.get(url);
    return response.data;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

DocsWs.prototype.addDocument = async function(oBody) {
  try {
    const response = await axios.post(this.docsUrl, oBody);
    return response.data;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};

DocsWs.prototype.searchTerms = async function(oQuery) {
  try {
    let sURL = this.docsUrl + `?q=${oQuery.q}&start=${oQuery.start}&count=${oQuery.count}`;
    const response = await axios.get(sURL);
    return response.data;
  }
  catch (err) {
    throw (err.response && err.response.data) ? err.response.data : err;
  }
};