// copy-layers.jsx
// Process a folder of sticker pack images.
// - Resize the files
// - Save as PSD
// - Create versions of each file using templates
// - 1. Plain image
// - 2. Image with label "I Love {XYZ}"
// - 3. Image with label "I Was Here"
// - 4. Image with label

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

function copyLayer(outputFolder, templateFile, layerName) {
    var fileWithLabel = open(templateFile)
    var layers = fileWithLabel.layers
    layerSet = layers.getByName(layerName)
    // Loop files and add layer
    var fileList = outputFolder.getFiles()
    for(var i=0; i<fileList.length; i++) {
        filePath = fileList[i]
        if (filePath instanceof File && (filePath.name.match(/\.psd$/i)) && filePath.hidden == false) { 
            var targetFile = open(filePath)
            app.activeDocument = fileWithLabel
            duplicateLayerSet = layerSet.duplicate( targetFile, ElementPlacement.PLACEATBEGINNING )
            app.activeDocument = targetFile
            targetFile.save()
            targetFile.close()
        }
    }
    app.activeDocument = fileWithLabel
    fileWithLabel.close()
}

function setLabelToFilename(outputFolder, layerName) {
    var fileList = outputFolder.getFiles()
    for(var i=0; i<fileList.length; i++) {
        filePath = fileList[i]
        if (filePath instanceof File && (filePath.name.match(/\.psd$/i)) && filePath.hidden == false) { 
            var baseName = filePath.name.split('.')[0]
            baseName = decodeURI(baseName)
            var fileWithLabel = open(filePath)
            var layers = fileWithLabel.layers
            layerSet = layers.getByName(layerName);
            var setLayers = layerSet.layers
            var numLabelLayers = setLayers.length
            for(var j=0; j<numLabelLayers; j++) {
                var setLayer = setLayers[j]
                var setLayerName = setLayer.name
                if (setLayer.kind == "LayerKind.TEXT") {
                    var newText = baseName
                    var textItemRef = setLayer.textItem
                    textItemRef.contents = newText
                }
            }
            fileWithLabel.save()
            fileWithLabel.close()
        }
    }
}

function getOutputSize(inputSize) {
    const maxDimension = 618
    var inputW = inputSize[0]
    var inputH = inputSize[1]
    if (inputW > inputH) {
        var outputW = maxDimension
        var outputH = maxDimension * inputH / inputW
    } else {
        var outputH = maxDimension
        var outputW = maxDimension * inputW / inputH
    }
    var outputSize = [outputW,outputH]
    return outputSize
}

try {
    // Use script location for relative path
    var scriptFile = new File($.fileName)
    var scriptPath = scriptFile.parent.fsName

    // Set input folder
    var inputFolder = Folder(scriptPath + '/input')

    // Set output folders
    var outputFolderPlain = Folder(scriptPath + '/output/psd-plain')
    var outputFolderLabel = Folder(scriptPath + '/output/psd-label')
    var outputFolderLogo1 = Folder(scriptPath + '/output/psd-logo-1')
    var outputFolderLogo2 = Folder(scriptPath + '/output/psd-logo-2')
    var outputFolderPNG = Folder(scriptPath + '/output/png')

    // ====================================================================
    // Set PSD output file save options
    // ====================================================================
    psdSaveOptions = new PhotoshopSaveOptions()
    psdSaveOptions.embedColorProfile = true
    psdSaveOptions.alphaChannels = true
    psdSaveOptions.annotations = false
    psdSaveOptions.layers = false
    psdSaveOptions.spotColors = false

    // ====================================================================
    // Resize input files and save to PSD
    // ====================================================================
    var doResize = true
    if (doResize) {
        var fileList = inputFolder.getFiles()
        for(var i=0; i<fileList.length; i++) {
            filePath = fileList[i]
            if (filePath instanceof File && (filePath.name.match(/\.jpg$/i) || filePath.name.match(/\.jpeg$/i) || filePath.name.match(/\.png$/i) || filePath.name.match(/\.gif$/i)) && filePath.hidden == false) { 
                var inputDocument = open (filePath)
                var inputWidth = parseInt(inputDocument.width, 10)
                var inputHeight = parseInt(inputDocument.height, 10)
                var inputSize = [inputWidth, inputHeight]
                var outputSize = getOutputSize(inputSize)
                var w = new UnitValue (outputSize[0] + ' pixels')
                var h = new UnitValue (outputSize[1] + ' pixels')
                inputDocument.resizeImage (w, h, 72)
                var baseName = filePath.name.split('.')[0]
                var outputFile = new File (decodeURI (outputFolderPlain) + "/" + baseName + ".psd")
                inputDocument.saveAs(outputFile, psdSaveOptions, false, Extension.LOWERCASE)
                inputDocument.close (SaveOptions.DONOTSAVECHANGES)
            }
        }
    }

    // ====================================================================
    // Visit each plain copy and create copies for each folder
    // ====================================================================
    var doCopyPlain = true
    if (doCopyPlain) {
        var fileList = outputFolderPlain.getFiles()
        for(var i=0; i<fileList.length; i++) {
            filePath = fileList[i]
            if (filePath instanceof File && (filePath.name.match(/\.psd$/i)) && filePath.hidden == false) { 
                var plainFile = open(filePath)

                var labelFile = new File (decodeURI (outputFolderLabel) + "/" + filePath.name)
                var logo1File = new File (decodeURI (outputFolderLogo1) + "/" + filePath.name)
                var logo2File = new File (decodeURI (outputFolderLogo2) + "/" + filePath.name)

                plainFile.saveAs(labelFile, psdSaveOptions, false, Extension.LOWERCASE)
                plainFile.saveAs(logo1File, psdSaveOptions, false, Extension.LOWERCASE)
                plainFile.saveAs(logo2File, psdSaveOptions, false, Extension.LOWERCASE)

                plainFile.close (SaveOptions.DONOTSAVECHANGES)
            }
        }
    }

    // ====================================================================
    // Copy layers. Change the label layer to the name of the file.
    // ====================================================================
    var doCopy = true
    if (doCopy) {
        // Get label template and text layer
        var templateFile = File(scriptPath + '/input/layers/layers.psd')
        var layerName = "label"
        copyLayer(outputFolderLabel, templateFile, layerName)
        setLabelToFilename(outputFolderLabel, layerName)
        var layerName = "logo1"
        copyLayer(outputFolderLogo1, templateFile, layerName)
        var layerName = "logo2"
        copyLayer(outputFolderLogo2, templateFile, layerName)
    }
    alert('Done')
} catch (exception) {
    // Show debug message and then quit
    if ((exception != null) && (exception != ""))
        alert(exception)
} finally {
}
