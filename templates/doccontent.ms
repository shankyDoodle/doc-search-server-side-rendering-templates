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
            <div class="appName doc-name">{{name}}</div>
            {{>navigator}}
        </div>
        <div class="bodyContainer">
            <div class="docContentContainer content">
                {{content}}
                {{#errorMessage}}<div class="docContentErrorMessage error">{{errorMessage}}</div>{{/errorMessage}}
            </div>
        </div>
    </div>
</div>
</body>
</html>