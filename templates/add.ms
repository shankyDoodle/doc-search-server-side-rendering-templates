<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
    <script>
          function submitDropFileForm(){
            document.getElementById('dropFileForm').submit();
          }

          function inputDropClicked(){
            document.getElementsByClassName('inputDropzone')[0].click();
            var fullPath = document.getElementById('upload').value;
            console.log(fullPath);
            debugger;
          }

          function handleSubmitButtonClicked(){
            document.getElementById('dropFileForm').submit();
          }

          function showFileName(){
            let sFileName = document.getElementsByClassName('inputDropzone')[0].files[0].name;
            let oFileNameDOM = document.getElementById('showFileName');
            oFileNameDOM.innerHTML = "<span>File Name: <b>"+ sFileName +"</b></span>";

          }
        </script>
</head>
<body>
<div class="appContainerWrapper">
<div class="appContainer">
    <div class="headerBarContainer">
        <div class="appName">Docs Homepage</div>
        {{>navigator}}
    </div>
    <div class="bodyContainer">
        <div class="fileDropZoneContainer">
            <form id="dropFileForm" method="POST" action="{{{base}}}/add" class="dropzone" enctype="multipart/form-data" onchange="showFileName()">
                <input id="file" class="inputDropzone" name="file" type="file" multiple/>
                <span class="dropHere" onclick="inputDropClicked()">Drop File Here<br/>Or<br/>Click To Choose File</span>
                <input id="submit" class="addFileButton" type="submit" value="Add" onclick="handleSubmitButtonClicked()">
                <div id="showFileName"></>
            </form>
        </div>
        {{#errorMessage}}<span class="errorMessageFileUpload error">{{errorMessage}}</span>{{/errorMessage}}
    </div>
</div>
</div>
</body>
</html>