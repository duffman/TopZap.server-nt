"use strict";
/**
 * Written by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * September 2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayChunker {
    constructor(arrayData, chunkSize) {
        this.pointer = 0;
        this.chunks = ArrayChunker.splitIntoChunks(arrayData, chunkSize);
    }
    [Symbol.iterator]() {
        let pointer = 0;
        let components = this.chunks;
        return {
            next() {
                if (pointer < components.length) {
                    return {
                        done: false,
                        value: components[pointer++]
                    };
                }
                else {
                    return {
                        done: true,
                        value: null
                    };
                }
            }
        };
    }
    next() {
        if (this.pointer < this.chunks.length) {
            return {
                done: false,
                value: this.chunks[this.pointer++]
            };
        }
        else {
            return {
                done: true,
                value: this.chunks[this.pointer]
            };
        }
    }
    /**
     * Divide given array into array chunks of specified size
     * @param {Array<any>} arrayData
     * @param {number} chunkSize
     * @returns {ArrayChunkContainer}
     */
    static splitIntoChunks(arrayData, chunkSize) {
        let result = new Array();
        let nrChunks = arrayData.length / chunkSize;
        for (let index = 0; index < nrChunks; index++) {
            let startPos = index * chunkSize;
            let endPos = startPos + chunkSize; //chunkSize * (index == 0 ? 1 : index);
            let chunk = arrayData.slice(startPos, endPos);
            result.push(chunk);
        }
        return result;
    }
}
exports.ArrayChunker = ArrayChunker;
