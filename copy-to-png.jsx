// copy-to-png.jsx
// ====================================================================
// LICENSE
// ====================================================================
// Copyright (c) 2020 Dan King https://www.vptech.io 
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// ====================================================================
// USAGE
// ====================================================================
//
// Prepare an input folder with images to process
//
// From the PhotoShop menu bar select "File"->"Scripts"->"Browse...".
// Select this script in the browser window and then select "Open".
// When prompted, select input folder, output folder, source template and answer prompts regarding image size.
//
// ====================================================================
// REFERENCE
// ====================================================================
// Adobe PhotoShop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html
//
#target photoshop
app.bringToFront()

function copyLayer(inputFolderLabel, prefix, outputFolderPNG) {
    // ====================================================================
    // Set PNG output file save options
    // ====================================================================
    exportOptions = new ExportOptionsSaveForWeb()
    exportOptions.format = SaveDocumentType.PNG

    // ====================================================================
    //  Save as PNG: file in the folder
    // ====================================================================
    var fileList = inputFolderLabel.getFiles()
    for(var i=0; i<fileList.length; i++) {
        filePath = fileList[i]
        if (filePath instanceof File && (filePath.name.match(/\.psd$/i) && filePath.hidden == false)) { 
            var inputDocument = open (filePath)
            var baseName = filePath.name.split('.')[0]
            // Uncomment to begin new filename with the original name
            //var outputFile = new File (decodeURI (outputFolderPNG) + "/" + baseName + "_" + prefix +  ".png")
            // Uncomment to begin filename with the prefix
            var outputFile = new File (decodeURI (outputFolderPNG) + "/" + prefix + "_" + baseName +  ".png")
            inputDocument.exportDocument (outputFile, ExportType.SAVEFORWEB, exportOptions)
            inputDocument.close (SaveOptions.DONOTSAVECHANGES)
        }
    }
}

try {
    var scriptFile = new File($.fileName)
    var scriptPath = scriptFile.parent.fsName

    // Set output folders
    var outputFolderPNG = Folder(scriptPath + '/output/png')

    // Set input folders and run
    var inputFolder = Folder(scriptPath + '/output/psd-logo-1')
    var prefix = 'I Heart'
    copyLayer(inputFolder, prefix, outputFolderPNG)

    var inputFolder = Folder(scriptPath + '/output/psd-label')
    var prefix = 'Label'
    copyLayer(inputFolder, prefix, outputFolderPNG)

    var inputFolder = Folder(scriptPath + '/output/psd-logo-2')
    var prefix = 'I Was Here'
    copyLayer(inputFolder, prefix, outputFolderPNG)

    var inputFolder = Folder(scriptPath + '/output/psd-plain')
    var prefix = 'Picture'
    copyLayer(inputFolder, prefix, outputFolderPNG)

    alert('Done')
} catch (exception) {
    // Show debug message and then quit
    if ((exception != null) && (exception != ""))
        alert(exception)
} finally {
}
