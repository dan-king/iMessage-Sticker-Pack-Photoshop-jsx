// create-app-icons.jsx
// Create App Icons for iOS iMessages and Sticker Pack - xCode 11.4 circa 2020
// PhotoShop script to create iOS iMessage App and Sticker Pack icons from given source file(s).
// ====================================================================
// LICENSE
// ====================================================================
// Original work Copyright (c) 2010 Matt Di Pasquale, 2012 Josh Jones http://www.appsbynight.com
// Modified work Copyright (c) 2020 Dan King https://www.vptech.io 
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
// First create a Sticker Pack PNG image with size NxM px.
//
// From the PhotoShop menu bar select "File"->"Scripts"->"Browse...".
// Select this script in the browser window and then select "Open".
// When prompted, select input files and output folder.
//
// The script will create copies of the input file in the following sizes and the store them in the output folder.
// 24x34
// 240x340
//
// ====================================================================
// REFERENCE
// ====================================================================
// Adobe PhotoShop JavaScript Reference
// http://www.adobe.com/devnet/photoshop/scripting.html
//
// Apple iMessage App and Sticker Pack Icons
// https://developer.apple.com/design/human-interface-guidelines/ios/extensions/messaging/

#target photoshop
app.bringToFront()

function create_icons(inputFilePath, icons, outputFolder){
    var inputFile = open(inputFilePath, OpenDocumentType.PNG)

    // Save input file state for the undo operation
    var startState = inputFile.activeHistoryState

    // Do not include metadata in output
    inputFile.info = null

    for (i = 0; i < icons.length; i++) {
        var icon = icons[i]
        var outputFile = File(outputFolder + "/" + icon.name)
        inputFile.resizeImage(icon.width, icon.height, null, ResampleMethod.BICUBICSHARPER)
        inputFile.exportDocument(outputFile, ExportType.SAVEFORWEB, exportOptions)
        inputFile.activeHistoryState = startState // undo resize
    }
    inputFile.close (SaveOptions.DONOTSAVECHANGES)
}

try {
    // Get path to the project folder
    var scriptFile = File($.fileName)
    var scriptPath = scriptFile.parent.fsName

    // Set input folder
    var inputFolder = Folder(scriptPath + '/input/app-icons')

    // Set output folder
    var outputFolder = Folder(scriptPath + '/output/app-icons')

    // Set input files
    var inputFileSquarePath = File (decodeURI (inputFolder) + "/1024.png")
    var inputFileRectanglePath = File (decodeURI (inputFolder) + "/1024x768.png")

    // Specify 'pixels' as the unit
    app.preferences.rulerUnits = Units.PIXELS

    // Set PNG output file save options
    exportOptions = new ExportOptionsSaveForWeb()
    exportOptions.format = SaveDocumentType.PNG
    exportOptions.PNG8 = false // use PNG-24
    exportOptions.transparency = true

    // =====================================================
    // Process square icons
    // =====================================================
    var iconsSquare = [
        {"name": "1024x1024.png", "width":1024, "height":1024},
        {"name": "87x87.png",   "width":87,   "height":87},
        {"name": "58x58.png",   "width":58,   "height":58}
    ]
    create_icons(inputFileSquarePath, iconsSquare, outputFolder)

    // =====================================================
    // Process rectangle icons
    // =====================================================
    var iconsRectangle = [
        {"name": "1024x768.png", "width":1024, "height":768},
        {"name": "180x135.png",  "width":180,  "height":135},
        {"name": "148x110.png",  "width":148,  "height":110},
        {"name": "134x100.png",  "width":134,  "height":100},
        {"name": "120x90.png",   "width":120,  "height":90},
        {"name": "96x72.png",    "width":96,   "height":72},
        {"name": "81x60.png",    "width":81,   "height":60},
        {"name": "64x48.png",    "width":64,   "height":48},
        {"name": "54x40.png",    "width":54,   "height":40}
    ]
    create_icons(inputFileRectanglePath, iconsRectangle, outputFolder)

    alert("iMessage App and Sticker Pack icons successfully created!")
}
catch (exception) {
    // Show debug message and then quit
    if ((exception != null) && (exception != ""))
        alert(exception)
}
finally {
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES)
}
