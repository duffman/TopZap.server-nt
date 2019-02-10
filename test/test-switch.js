"use strict";
exports.__esModule = true;
var TestSwitch = /** @class */ (function () {
    function TestSwitch() {
        var allan = "kalle";
        switch (allan) {
            case "kalle":
                console.log("YEAS");
                break;
            case "uffe":
                console.log("Uffe");
                break;
            default:
                console.log("Lollo");
                break;
        }
    }
    return TestSwitch;
}());
exports.TestSwitch = TestSwitch;
var app = new TestSwitch();
var allan = "\nCD Audio\nGame not found\nGameboy Advance\nGameCube\nMac\nMultiformat\nN-gage\nNintendo 3DS\nNintendo 64\nNintendo DS\nNintendo DS/DSi\nNintendo NES\nNintendo Switch\nNintendo Wii\nNintendo Wii U\nPC\nPC Download\nPC/Mac\nPlayStation\nPlayStation 2\nPlayStation 3\nPlayStation 4\nPlayStation Portable\nPlayStation Vita\nPSP\nWii\nWii U\nXbox\nXbox 360\nXbox One";
console.log(allan.toLowerCase());
