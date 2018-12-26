<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
</head>
<body>
<div class="appContainerWrapper">
<div class="appContainer">
    <div class="headerBarContainer">
        <div class="appName">Docs Homepage</div>
        {{>navigator}}
    </div>
    <div class="bodyContainer">
        <div class="homeActionButtonsContainer">
            <div class="homeActionButton">
                <a id="add" class="navigatorHomeLink" href="{{{base}}}/add.html">
                    <span class="homeActionButtonLabel">Add</span>
                    <span class="homeActionButtonDescription">Add a new document.</span>
                </a>
            </div>
            <div class="homeActionButton">
                <a id="search" class="navigatorHomeLink" href="{{{base}}}/search.html">
                    <span class="homeActionButtonLabel">Search</span>
                    <span class="homeActionButtonDescription">Search document for one or more search-terms.</span>
                </a>
            </div>
        </div>

    </div>
</div>
</div>

</body>
</html>