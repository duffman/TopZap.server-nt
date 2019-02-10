"use strict";
exports.__esModule = true;
var ArrayChunkContainer = /** @class */ (function () {
    function ArrayChunkContainer() {
    }
    return ArrayChunkContainer;
}());
exports.ArrayChunkContainer = ArrayChunkContainer;
var ArrayChunk = /** @class */ (function () {
    function ArrayChunk() {
    }
    ArrayChunk.splitIntoChunks = function (arrayData, chunkSize) {
        var result = new ArrayChunkContainer();
        var nrChunks = arrayData.length / chunkSize;
        console.log("nrChunks", nrChunks);
        return result;
    };
    return ArrayChunk;
}());
exports.ArrayChunk = ArrayChunk;
var strArray = ["SLOT_1", "SLOT_2", "SLOT_3", "SLOT_4", "SLOT_5",
    "SLOT_6", "SLOT_7", "SLOT_8", "SLOT_9", "SLOT_10",
    "SLOT_11", "SLOT_12", "SLOT_13", "SLOT_14", "SLOT_15",
    "SLOT_16", "SLOT_17", "SLOT_18", "SLOT_19", "SLOT_20",
    "SLOT_21", "SLOT_22", "SLOT_23", "SLOT_24"];
var chunked = ArrayChunk.splitIntoChunks(strArray, 4);
