/*jslint browser: true*/
/*global $, jQuery, console*/

$(document).ready(function () {
    "use strict";
    // Global inits
    var draw,
        e =  document.getElementById('editorCanvas'),
        accButton = document.getElementById('toggleAccordion'),
        accordion = document.getElementsByClassName("hiddenTool"),
        elemLeft = e.offsetLeft,
        elemTop = e.offsetTop,
        context = e.getContext('2d'),
        elements = [],
        undoStack = [],
        redoStack = [],
        defaultQMKFont = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3E, 0x5B, 0x4F, 0x5B, 0x3E, 0x00, 0x3E, 0x6B, 0x4F, 0x6B, 0x3E, 0x00, 0x1C, 0x3E, 0x7C, 0x3E, 0x1C, 0x00, 0x18, 0x3C, 0x7E, 0x3C, 0x18, 0x00, 0x1C, 0x57, 0x7D, 0x57, 0x1C, 0x00, 0x1C, 0x5E, 0x7F, 0x5E, 0x1C, 0x00, 0x00, 0x18, 0x3C, 0x18, 0x00, 0x00, 0xFF, 0xE7, 0xC3, 0xE7, 0xFF, 0x00, 0x00, 0x18, 0x24, 0x18, 0x00, 0x00, 0xFF, 0xE7, 0xDB, 0xE7, 0xFF, 0x00, 0x30, 0x48, 0x3A, 0x06, 0x0E, 0x00, 0x26, 0x29, 0x79, 0x29, 0x26, 0x00, 0x40, 0x7F, 0x05, 0x05, 0x07, 0x00, 0x40, 0x7F, 0x05, 0x25, 0x3F, 0x00, 0x5A, 0x3C, 0xE7, 0x3C, 0x5A, 0x00, 0x7F, 0x3E, 0x1C, 0x1C, 0x08, 0x00, 0x08, 0x1C, 0x1C, 0x3E, 0x7F, 0x00, 0x14, 0x22, 0x7F, 0x22, 0x14, 0x00, 0x5F, 0x5F, 0x00, 0x5F, 0x5F, 0x00, 0x06, 0x09, 0x7F, 0x01, 0x7F, 0x00, 0x00, 0x66, 0x89, 0x95, 0x6A, 0x00, 0x60, 0x60, 0x60, 0x60, 0x60, 0x00, 0x94, 0xA2, 0xFF, 0xA2, 0x94, 0x00, 0x08, 0x04, 0x7E, 0x04, 0x08, 0x00, 0x10, 0x20, 0x7E, 0x20, 0x10, 0x00, 0x08, 0x08, 0x2A, 0x1C, 0x08, 0x00, 0x08, 0x1C, 0x2A, 0x08, 0x08, 0x00, 0x1E, 0x10, 0x10, 0x10, 0x10, 0x00, 0x0C, 0x1E, 0x0C, 0x1E, 0x0C, 0x00, 0x30, 0x38, 0x3E, 0x38, 0x30, 0x00, 0x06, 0x0E, 0x3E, 0x0E, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x5F, 0x00, 0x00, 0x00, 0x00, 0x07, 0x00, 0x07, 0x00, 0x00, 0x14, 0x7F, 0x14, 0x7F, 0x14, 0x00, 0x24, 0x2A, 0x7F, 0x2A, 0x12, 0x00, 0x23, 0x13, 0x08, 0x64, 0x62, 0x00, 0x36, 0x49, 0x56, 0x20, 0x50, 0x00, 0x00, 0x08, 0x07, 0x03, 0x00, 0x00, 0x00, 0x1C, 0x22, 0x41, 0x00, 0x00, 0x00, 0x41, 0x22, 0x1C, 0x00, 0x00, 0x2A, 0x1C, 0x7F, 0x1C, 0x2A, 0x00, 0x08, 0x08, 0x3E, 0x08, 0x08, 0x00, 0x00, 0x80, 0x70, 0x30, 0x00, 0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00, 0x00, 0x60, 0x60, 0x00, 0x00, 0x20, 0x10, 0x08, 0x04, 0x02, 0x00, 0x3E, 0x51, 0x49, 0x45, 0x3E, 0x00, 0x00, 0x42, 0x7F, 0x40, 0x00, 0x00, 0x72, 0x49, 0x49, 0x49, 0x46, 0x00, 0x21, 0x41, 0x49, 0x4D, 0x33, 0x00, 0x18, 0x14, 0x12, 0x7F, 0x10, 0x00, 0x27, 0x45, 0x45, 0x45, 0x39, 0x00, 0x3C, 0x4A, 0x49, 0x49, 0x31, 0x00, 0x41, 0x21, 0x11, 0x09, 0x07, 0x00, 0x36, 0x49, 0x49, 0x49, 0x36, 0x00, 0x46, 0x49, 0x49, 0x29, 0x1E, 0x00, 0x00, 0x00, 0x14, 0x00, 0x00, 0x00, 0x00, 0x40, 0x34, 0x00, 0x00, 0x00, 0x00, 0x08, 0x14, 0x22, 0x41, 0x00, 0x14, 0x14, 0x14, 0x14, 0x14, 0x00, 0x00, 0x41, 0x22, 0x14, 0x08, 0x00, 0x02, 0x01, 0x59, 0x09, 0x06, 0x00, 0x3E, 0x41, 0x5D, 0x59, 0x4E, 0x00, 0x7C, 0x12, 0x11, 0x12, 0x7C, 0x00, 0x7F, 0x49, 0x49, 0x49, 0x36, 0x00, 0x3E, 0x41, 0x41, 0x41, 0x22, 0x00, 0x7F, 0x41, 0x41, 0x41, 0x3E, 0x00, 0x7F, 0x49, 0x49, 0x49, 0x41, 0x00, 0x7F, 0x09, 0x09, 0x09, 0x01, 0x00, 0x3E, 0x41, 0x41, 0x51, 0x73, 0x00, 0x7F, 0x08, 0x08, 0x08, 0x7F, 0x00, 0x00, 0x41, 0x7F, 0x41, 0x00, 0x00, 0x20, 0x40, 0x41, 0x3F, 0x01, 0x00, 0x7F, 0x08, 0x14, 0x22, 0x41, 0x00, 0x7F, 0x40, 0x40, 0x40, 0x40, 0x00, 0x7F, 0x02, 0x1C, 0x02, 0x7F, 0x00, 0x7F, 0x04, 0x08, 0x10, 0x7F, 0x00, 0x3E, 0x41, 0x41, 0x41, 0x3E, 0x00, 0x7F, 0x09, 0x09, 0x09, 0x06, 0x00, 0x3E, 0x41, 0x51, 0x21, 0x5E, 0x00, 0x7F, 0x09, 0x19, 0x29, 0x46, 0x00, 0x26, 0x49, 0x49, 0x49, 0x32, 0x00, 0x03, 0x01, 0x7F, 0x01, 0x03, 0x00, 0x3F, 0x40, 0x40, 0x40, 0x3F, 0x00, 0x1F, 0x20, 0x40, 0x20, 0x1F, 0x00, 0x3F, 0x40, 0x38, 0x40, 0x3F, 0x00, 0x63, 0x14, 0x08, 0x14, 0x63, 0x00, 0x03, 0x04, 0x78, 0x04, 0x03, 0x00, 0x61, 0x59, 0x49, 0x4D, 0x43, 0x00, 0x00, 0x7F, 0x41, 0x41, 0x41, 0x00, 0x02, 0x04, 0x08, 0x10, 0x20, 0x00, 0x00, 0x41, 0x41, 0x41, 0x7F, 0x00, 0x04, 0x02, 0x01, 0x02, 0x04, 0x00, 0x40, 0x40, 0x40, 0x40, 0x40, 0x00, 0x00, 0x03, 0x07, 0x08, 0x00, 0x00, 0x20, 0x54, 0x54, 0x78, 0x40, 0x00, 0x7F, 0x28, 0x44, 0x44, 0x38, 0x00, 0x38, 0x44, 0x44, 0x44, 0x28, 0x00, 0x38, 0x44, 0x44, 0x28, 0x7F, 0x00, 0x38, 0x54, 0x54, 0x54, 0x18, 0x00, 0x00, 0x08, 0x7E, 0x09, 0x02, 0x00, 0x18, 0xA4, 0xA4, 0x9C, 0x78, 0x00, 0x7F, 0x08, 0x04, 0x04, 0x78, 0x00, 0x00, 0x44, 0x7D, 0x40, 0x00, 0x00, 0x20, 0x40, 0x40, 0x3D, 0x00, 0x00, 0x7F, 0x10, 0x28, 0x44, 0x00, 0x00, 0x00, 0x41, 0x7F, 0x40, 0x00, 0x00, 0x7C, 0x04, 0x78, 0x04, 0x78, 0x00, 0x7C, 0x08, 0x04, 0x04, 0x78, 0x00, 0x38, 0x44, 0x44, 0x44, 0x38, 0x00, 0xFC, 0x18, 0x24, 0x24, 0x18, 0x00, 0x18, 0x24, 0x24, 0x18, 0xFC, 0x00, 0x7C, 0x08, 0x04, 0x04, 0x08, 0x00, 0x48, 0x54, 0x54, 0x54, 0x24, 0x00, 0x04, 0x04, 0x3F, 0x44, 0x24, 0x00, 0x3C, 0x40, 0x40, 0x20, 0x7C, 0x00, 0x1C, 0x20, 0x40, 0x20, 0x1C, 0x00, 0x3C, 0x40, 0x30, 0x40, 0x3C, 0x00, 0x44, 0x28, 0x10, 0x28, 0x44, 0x00, 0x4C, 0x90, 0x90, 0x90, 0x7C, 0x00, 0x44, 0x64, 0x54, 0x4C, 0x44, 0x00, 0x00, 0x08, 0x36, 0x41, 0x00, 0x00, 0x00, 0x00, 0x77, 0x00, 0x00, 0x00, 0x00, 0x41, 0x36, 0x08, 0x00, 0x00, 0x02, 0x01, 0x02, 0x04, 0x02, 0x00, 0x3C, 0x26, 0x23, 0x26, 0x3C, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x40, 0x40, 0xF0, 0xF8, 0xF8, 0xFF, 0x38, 0xFF, 0xF8, 0xF8, 0x3F, 0xF8, 0xF8, 0xFF, 0x38, 0xFF, 0xF8, 0xF8, 0xF0, 0x40, 0x40, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0xC0, 0xC0, 0xC0, 0x80, 0x00, 0x00, 0xC0, 0xC0, 0x80, 0x00, 0x00, 0x00, 0x80, 0xC0, 0xC0, 0x00, 0xC0, 0xC0, 0x00, 0x00, 0x80, 0xC0, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0x00, 0xC0, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xC0, 0xF0, 0xF8, 0xFC, 0x3E, 0x1E, 0x06, 0x01, 0x00, 0x00, 0x00, 0x7F, 0x41, 0x41, 0x41, 0x7F, 0x00, 0x7F, 0x41, 0x41, 0x41, 0x7F, 0x00, 0x00, 0x80, 0xC0, 0xE0, 0x7E, 0x5B, 0x4F, 0x5B, 0xFE, 0xC0, 0x00, 0x00, 0xC0, 0x00, 0xDC, 0xD7, 0xDE, 0xDE, 0xDE, 0xD7, 0xDC, 0x00, 0xC0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x49, 0x49, 0x49, 0xFF, 0xFF, 0xFF, 0xFF, 0xE0, 0xDF, 0xBF, 0xBF, 0x00, 0xBF, 0xBF, 0xDF, 0xE0, 0xFF, 0xFF, 0xFF, 0xFF, 0x49, 0x49, 0x49, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1F, 0x3F, 0x60, 0x60, 0xE0, 0xBF, 0x1F, 0x00, 0x7F, 0x7F, 0x07, 0x1E, 0x38, 0x1E, 0x07, 0x7F, 0x7F, 0x00, 0x7F, 0x7F, 0x0E, 0x1F, 0x3B, 0x71, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7F, 0x7F, 0x0C, 0x0C, 0x0C, 0x00, 0x7E, 0x7E, 0x00, 0x7F, 0x7E, 0x03, 0x03, 0x00, 0x7F, 0x7E, 0x03, 0x03, 0x7E, 0x7E, 0x03, 0x03, 0x7F, 0x7E, 0x00, 0x0F, 0x3E, 0x70, 0x3C, 0x06, 0x3C, 0x70, 0x3E, 0x0F, 0x00, 0x32, 0x7B, 0x49, 0x49, 0x3F, 0x7E, 0x00, 0x7F, 0x7E, 0x03, 0x03, 0x00, 0x1E, 0x3F, 0x69, 0x69, 0x6F, 0x26, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x0F, 0x1F, 0x3F, 0x3C, 0x78, 0x70, 0x60, 0x00, 0x00, 0x00, 0x7F, 0x41, 0x41, 0x41, 0x7F, 0x00, 0x7F, 0x41, 0x41, 0x41, 0x7F, 0x00, 0x30, 0x7B, 0x7F, 0x78, 0x30, 0x20, 0x20, 0x30, 0x78, 0x7F, 0x3B, 0x00, 0x03, 0x00, 0x0F, 0x7F, 0x0F, 0x0F, 0x0F, 0x7F, 0x0F, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01, 0x07, 0x0F, 0x0F, 0x7F, 0x0F, 0x7F, 0x0F, 0x0F, 0x7E, 0x0F, 0x0F, 0x7F, 0x0F, 0x7F, 0x0F, 0x0F, 0x07, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ];

    // Clear Canvas Function
    function clearCanvas(canvas) {
        canvas.fillStyle = '#ffffff';
        canvas.fillRect(0, 0, canvas.width, canvas.length);
    }

    // Undo Function
    function undo(canvas, uStack, rStack) {
        var tempImg = uStack[uStack.length - 1];
        try {
            canvas.putImageData(tempImg, 0, 0);
        } catch (error) {
            return;
        }
        if (uStack.length !== 1) {
            rStack.push(uStack.pop());
        }
    }

    function redo(canvas, uStack, rStack) {
        var tempImg = rStack[rStack.length - 1];
        try {
            canvas.putImageData(tempImg, 0, 0);
        } catch (error) {
            return;
        }
        uStack.push(rStack.pop());
    }

    // Save State After Each MouseUp
    function save(canvas, uStack) {
        uStack.push(canvas.getImageData(0, 0, canvas.width, canvas.length));
    }

    function invert(canvas, uStack, rStack) {
        var img = canvas.getImageData(0, 0, canvas.width, canvas.length),
            pix = img.data,
            i;

        uStack.push(img);
        rStack = [];

        for (i = 0; i < pix.length; i += 4) {
            // Check if pixel is not black, if not, turn it to white, if it is, turn to black
            if (pix[i] > 0) {
                pix[i] = 0;
                pix[i + 1] = 0;
                pix[i + 2] = 0;
            } else {
                pix[i] = 255;
                pix[i + 1] = 255;
                pix[i + 2] = 255;
            }
        }
        canvas.putImageData(img, 0, 0);
    }
    
/* Change functionality, right now is unused
    function addText(doc, canvas) {
        var text = doc.getElementById("form").value,
            i;
        canvas.fillStyle = "#000000";
        canvas.font = "bold 14px Arial";
        canvas.textAlign = "center";
        for (i = 0; i < text.length; i += 1) {
            canvas.fillText(text.charAt(i), 11, 15 * i + 11);
        }
        draw = false;
    }
*/

    // RAW Binary (1010101010001010001001011111....)
    function parseImg(canvas) {
        var binaryState = [],
            img = canvas.getImageData(0, 0, canvas.width, canvas.length),
            pix = img.data,
            i;
        for (i = 0; i < pix.length; i += 4) {
            if (pix[i] > 0) {
                binaryState.push(0);
            } else {
                binaryState.push(1);
            }
        }
        return binaryState;
    }

    // Formatted Binary (10101010, 01110000, 0000000, ...)
    // Right now it only works for qmk logo minus 2 character 102 x 24 image
    function binary2array2D(arr) {
        var mainArray = [],
            counter = 0,
            tempArray = [],
            i,
            j;
        for (i = 0; i < 102; i += 1) {
            tempArray = [];
            for (j = 0; j < 24; j += 1) {
                tempArray.push(arr[counter]);
                counter += 1;
            }
            mainArray.push(tempArray);
        }
        return mainArray;
    }

    // array of string ( "1", '3', '51', '23', '12', '11', '32', ...)
    function parseArray(arr) {
        var A = "",
            B = "",
            C = "",
            tempA = "",
            tempB = "",
            tempC = "",
            i,
            j;
        for (i = 0; i < 102; i += 1) {
            tempA = "";
            tempB = "";
            tempC = "";
            for (j = 0; j < 8; j += 1) {
                tempA += (arr[i][23 - j].toString());
                tempB += (arr[i][15 - j].toString());
                tempC += (arr[i][7 - j].toString());
            }
            A = A + (parseInt(tempA, 2).toString()) + ",";
            B = B + (parseInt(tempB, 2).toString()) + ",";
            C = C + (parseInt(tempC, 2).toString()) + ",";

        }
        A = A + B + C;
        return A.split(",");
    }

    // Curently only swap out default qmk font logo with user logo
    function finalMerge(oledHexString, userFont) {
        var tempFont = userFont,
            i;
        for (i = 0; i < 102; i += 1) {
            tempFont[767 + i] = parseInt(oledHexString[i], 10);
            tempFont[959 + i] = parseInt(oledHexString[102 + i], 10);
            tempFont[1152 + i] = parseInt(oledHexString[204 + i], 10);
        }
        for (i = 0; i < 12; i += 1) {
            tempFont[869 + i] = 0;
            tempFont[1061 + i] = 0;
            tempFont[1254 + i] = 0;
        }
        return tempFont;
    }

    function printHex(doc, userFont) {
        var txtAr = doc.getElementById("result"),
            finalTxt = finalMerge(parseArray(binary2array2D(parseImg()))),
            outputStr = "",
            counter = 0,
            temp = 0,
            i;
        for (i = 0; i < userFont.length; i += 1) {
            counter += 1;
            temp = finalTxt[i].toString(16);

            if (temp.length === 1) {
                temp = "0" + temp;
            }
            //console.log(temp);
            outputStr += ("0x" + temp + ",");

            if (counter === 400) {
                outputStr += ("\n");
                counter = 0;
            }
        }
        txtAr.value = outputStr;
    }

    // main Method
    
    context.fillStyle = '#000000';
    context.fillRect(0, 0, e.width, e.height);
    undoStack[0] = context.getImageData(0, 0, e.width, e.height);
    console.log("init reached");

    // event listener for click event
    e.addEventListener('click', function (event) {
        var winX = event.clientX - elemLeft,
            winY = event.clientY - elemTop,
            xVal = winX * context.canvas.width / context.canvas.clientWidth,
            yVal = winY * context.canvas.height / context.canvas.clientHeight;
        console.log("click");
        elements.forEach(function (ele) {
            if (yVal > ele.top && yVal < ele.height && xVal > ele.left && xVal < ele.width) {
                context.fillRect(xVal, yVal, 1, 1);
            }
        });
    }, false);

    //mobile support

    e.addEventListener('pointerdown', function (event) {
        draw = true;
        console.log("pointerdown");
    }, false);

    e.addEventListener('pointerup', function (event) {
        draw = false;
        redoStack = [];
        console.log("pointerup");
        redoStack[0] = context.getImageData(0, 0, e.width, e.height);
        save(context, undoStack);
    }, false);

    e.addEventListener('pointermove', function (event) {
        console.log("pointermove");
        if (draw === true) {
            var winX = event.pageX - elemLeft,
                winY = event.pageY - elemTop,
                xVal = winX * context.canvas.width / context.canvas.clientWidth,
                yVal = winY * context.canvas.height / context.canvas.clientHeight;
            context.fillStyle = "#ffffff";
            elements.forEach(function (ele) {
                if (yVal > ele.top && yVal < ele.height && xVal > ele.left && xVal < ele.width) {
                    context.fillRect(xVal, yVal, 1, 1);
                }
            });
        }
    }, false);
    
    accButton.addEventListener('click', function (event) {
        var i;
        for (i = 0; i < accordion.length; i += 1) {
            if (accordion[i].style.display === "none") {
                accordion[i].style.display = "block";
            } else {
                accordion[i].style.display = "none";
            }
        }
    }, false);
    
    //Duplicate code? for now remove
    /*
    e.addEventListener('pointerup', function (event) {
        var xVal = event.pageX - elemLeft,
            yVal = event.pageY - elemTop;
        elements.forEach(function (ele) {
            if (yVal > ele.top && yVal < ele.height && xVal > ele.left && xVal < ele.width) {
                context.fillRect(xVal, yVal, 1, 1);
            }
        });
    }, false);
    */
    
    elements.push({
        color: '#ffffff',
        width: e.width,
        height: e.height,
        top: 0,
        left: 0
    });
    elements.forEach(function (ele) {
        context.fillStyle = elements.color;
        context.fillRect(ele.left, ele.top, ele.width, ele.height);
    });
});