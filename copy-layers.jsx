// copy-layers.jsx
// Process a folder of sticker pack images.
// - Resize the files
// - Save as PSD
// - Create versions of each file using visible layers in a template

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

function copyPSDFolder(inputFolder, outputFolder, psdSaveOptions) {
    var fileList = inputFolder.getFiles()
    for(var i=0; i<fileList.length; i++) {
        filePath = fileList[i]
        if (filePath instanceof File && (filePath.name.match(/\.psd$/i)) && filePath.hidden == false) { 
            var inputFile = open(filePath)
            var outputFile = new File (decodeURI (outputFolder) + "/" + filePath.name)
            inputFile.saveAs(outputFile, psdSaveOptions, false, Extension.LOWERCASE)
            inputFile.close (SaveOptions.DONOTSAVECHANGES)
        }
    }
}

function copyLayer(outputFolder, inputFile, inputLayer) {
    var targetList = outputFolder.getFiles()
    for(var i=0; i<targetList.length; i++) {
        targetPath = targetList[i]
        // Copy input layer to output file only if the output file is a PSD file and not hidden
        if (filePath instanceof File && (filePath.name.match(/\.psd$/i)) && filePath.hidden == false) { 
            var targetFile = open(targetPath)
            app.activeDocument = inputFile
            duplicateLayerSet = inputLayer.duplicate( targetFile, ElementPlacement.PLACEATBEGINNING )
            app.activeDocument = targetFile
            targetFile.save()
            targetFile.close()
        }
    }
    app.activeDocument = inputFile
}
    

function setLabelToFilename(outputFolder, labelLayerName) {
    var subFolderList = outputFolder.getFiles()
    //alert('subFolderList: ' + subFolderList)
    // Loop through the subfolders in the output folder
    for(var i=0; i<subFolderList.length; i++) {
        //alert('i')
        filePath = subFolderList[i]
        if (filePath instanceof Folder) { 
            var subFolderFiles = filePath.getFiles()
            // Loop through the files in the subfolder
            for(var j=0; j<subFolderFiles.length; j++) {
                //alert('j')
                subFolderFilePath = subFolderFiles[j]
                // Copy input layer to output file only if the output file is a PSD file and not hidden
                if (subFolderFilePath instanceof File && (subFolderFilePath.name.match(/\.psd$/i)) && subFolderFilePath.hidden == false) { 
                    var subFolderFile = open(subFolderFilePath)
                    //alert(subFolderFile)
                    var baseName = subFolderFile.name.split('.')[0]
                    baseName = decodeURI(baseName)
                    var layers = subFolderFile.layers
                    var numLayers = layers.length
                    // Loop through the layers in the file
                    for(var k=0; k<numLayers; k++) {
                        //alert('k')
                        layer = layers[k]
                        layerName = layer.name
                        //alert('layerName: ' + layerName)
                        if (layerName == labelLayerName) {
                            //alert('Found layer matching "labelLayerName" argument: ' + layerName)
                            var setLayers = layer.layers
                            var numLabelLayers = setLayers.length
                            // Loop through the sub-layers in the layer
                            for(var m=0; m<numLabelLayers; m++) {
                                //alert('m')
                                var setLayer = setLayers[m]
                                var setLayerName = setLayer.name
                                //alert('setLayerName: ' + setLayerName)
                                if (setLayer.kind == "LayerKind.TEXT") {
                                    var newText = baseName
                                    //alert('newText: ' + newText)
                                    var textItemRef = setLayer.textItem
                                    textItemRef.contents = newText
                                    subFolderFile.save()
                                }
                            }
                        }
                    }
                    subFolderFile.close()
                }
            }
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
    var inputFolder = Folder(scriptPath + '/input/images')

    // Set output folders
    var outputFolder = Folder(scriptPath + '/output')
    var outputFolderPlain = Folder(scriptPath + '/output/psd-plain')
    var outputFolderPNG = Folder(scriptPath + '/output/png')

    // Create output folders that don't exist
    folders = [outputFolder, outputFolderPlain, outputFolderPNG]
    for (index in folders) {
        folder = folders[index]
        if (!folder.exists) {
            folder.create()
        }
    }  

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
    // Copy layers. Change the label layer to the name of the file.
    // ====================================================================
    var doCopy = true
    if (doCopy) {
        // Get label template and text layer
        var templateFile = File(scriptPath + '/input/layers/layers.psd')
        var layerFile = open(templateFile)
        var layers = layerFile.layers
        var len = layers.length

        for (var i = 0; i < len; i++) {
            var layer = layers[i]
            var layerName = layer.name
            if (layer.visible) {
                var layer_num = i + 1
                var outputSubFolder = Folder(scriptPath + '/output/psd-layer-'+layer_num)

                // Create folder if not exists
                if (!outputSubFolder.exists) {
                    outputSubFolder.create()
                }

                // Copy source PSD files to the output folder
                copyPSDFolder(outputFolderPlain, outputSubFolder, psdSaveOptions)

                // Copy layers
                copyLayer(outputSubFolder, layerFile, layer)
            }
        }
        layerFile.save()
        layerFile.close()
    }

    // ====================================================================
    // Change the text value in any label layer to the name of the file
    // ====================================================================
    labelLayerName = 'label'
    setLabelToFilename(outputFolder, labelLayerName)

    // ====================================================================
    // Notify end user that we have finished.
    // ====================================================================
    alert('Done')

} catch (exception) {
    // Show debug message and then quit
    if ((exception != null) && (exception != ""))
        alert(exception)
} finally {
}
