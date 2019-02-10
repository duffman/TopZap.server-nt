/**
 * Written by Patrik Forsberg <patrik.forsberg@coldmind.com>
 * September 2018
 */

type ArrayChunkContainer = Array<Array<any>>;
type ArrayChunk = Array<any>

export class ArrayChunker implements Iterator<ArrayChunk> {
	private pointer = 0;
	private chunks: ArrayChunkContainer;

	constructor(arrayData: Array<any>, chunkSize: number) {
		this.chunks = ArrayChunker.splitIntoChunks(arrayData, chunkSize);
	}

	[Symbol.iterator]() {
		let pointer = 0;
		let components = this.chunks;

		return {
			next(): IteratorResult<ArrayChunk> {
				if (pointer < components.length) {
					return {
						done: false,
						value: components[pointer++]
					}
				} else {
					return {
						done: true,
						value: null
					}
				}
			}
		}
	}

	public next(): IteratorResult<ArrayChunk> {
		if (this.pointer < this.chunks.length) {
			return {
				done: false,
				value: this.chunks[this.pointer++]
			}
		} else {
			return {
				done: true,
				value: this.chunks[this.pointer]
			}
		}
	}

	/**
	 * Divide given array into array chunks of specified size
	 * @param {Array<any>} arrayData
	 * @param {number} chunkSize
	 * @returns {ArrayChunkContainer}
	 */
	public static splitIntoChunks(arrayData: Array<any>, chunkSize: number): Array<Array<any>> {
		let result = new Array<Array<any>>();
		let nrChunks = arrayData.length / chunkSize;

		for (let index = 0; index < nrChunks; index++) {
			let startPos = index * chunkSize;
			let endPos = startPos + chunkSize;  //chunkSize * (index == 0 ? 1 : index);
			let chunk = arrayData.slice(startPos, endPos);

			result.push(chunk);
		}

		return result;
	}
}