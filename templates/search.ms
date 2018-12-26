<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
    <script>

          function searchButtonClicked() {
            document.getElementById('searchBarContainerFormId').submit();
          }

          function paginationClicked(oDOM) {
            let sStart = oDOM.dataset.id;
            document.getElementById('ghostPaginationInput').value = sStart;
            document.getElementById('searchBarContainerFormId').submit();
          }
        </script>
</head>
<body>
<div class="appContainerWrapper">
<div class="appContainer">
    <div class="headerBarContainer">
        <div class="appName">Document Collection Search</div>
        {{>navigator}}
    </div>
    <div class="bodyContainer">
        <form id="searchBarContainerFormId" class="searchBarContainerForm" action="{{{base}}}/search" method="get">
            <div class="dummyWrapper">
                <input id="query" class="searchInput" name="q" placeholder="Please fill in one or more search terms." value="{{inputValue}}">
                <input id="ghostPaginationInput" name="start" placeholder="">
                <div id="submit" class="searchSubmitButton" onclick="searchButtonClicked()">Search</div>
            </div>
        </form>
        <div class="searchListPaginationWrapper">
        <div class="searchListContainer">
            {{#nothingToShow}}<div class="nothingToShow">{{nothingToShow}}</div>{{/nothingToShow}}
            {{#errorMessage}}<div class="errorMessage error">{{errorMessage}}</div>{{/errorMessage}}
            {{#list}}
                <div class="listNode">
                    <a class="listHeader doc-name" href="{{href}}">{{name}}</a>
                    {{#lines}}<span class="doc-line">{{{.}}}</span><br/>{{/lines}}
                </div>
            {{/list}}
        </div>
        <div class="nextPrevContainer">
            {{#next}}<div id="next" class="nextButton" onclick="paginationClicked(this)" data-id="{{start}}">Next ⇛</div>{{/next}}
            {{#previous}}<div id="previous" class="prevButton" onclick="paginationClicked(this)" data-id="{{start}}">⇚ Prev</div>{{/previous}}
        </div>
        </div>
    </div>
</div>
</div>
</body>
</html>