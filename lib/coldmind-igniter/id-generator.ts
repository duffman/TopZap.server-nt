/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const maxInt = Math.pow(2, 31) - 1;

export class IdGenerator {

	public static newId(): number {
		return new Date().getMilliseconds();
	}


	/*

	public hyperid(opts) {
		var fixedLength = false
		var urlSafe = false
		if (typeof opts === 'boolean') {
			fixedLength = opts
		} else {
			opts = opts || {}
			urlSafe = !!opts.urlSafe
			fixedLength = !!opts.fixedLength
		}

		var count = 0

		generate.uuid = uuid()
		var id = baseId(generate.uuid, urlSafe)

		function generate () {
			var result = fixedLength
				? id + pad(count++)
				: id + count++

			if (count === maxInt) {
				generate.uuid = uuid()
				id = baseId(generate.uuid, urlSafe) // rebase
				count = 0
			}

			return result
		}

		generate.decode = decode

		return generate
	}

	public pad (count) {
		if (count < 10) return '000000000' + count
		if (count < 100) return '00000000' + count
		if (count < 1000) return '0000000' + count
		if (count < 10000) return '000000' + count
		if (count < 100000) return '00000' + count
		if (count < 1000000) return '0000' + count
		if (count < 10000000) return '000' + count
		if (count < 100000000) return '00' + count
		if (count < 1000000000) return '0' + count
	}

	public baseId (id, urlSafe) {
		var base64Id = Buffer.from(parser.parse(id)).toString('base64')
		if (urlSafe) {
			return base64Id.replace(/\+/g, '_').replace(/\//g, '-').replace(/==$/, '-')
		}
		return base64Id.replace(/==$/, '/')
	}

	public decode (id, opts) {
		opts = opts || {}
		var urlSafe = !!opts.urlSafe

		if (urlSafe) {
			id = id.replace(/-/g, '/').replace(/_/g, '+')
		}

		const a = id.match(/(.*)+\/(\d+)+$/)

		if (!a) {
			return null
		}

		const result = {
			uuid: parser.unparse(Buffer.from(a[1] + '==', 'base64')),
			count: parseInt(a[2])
		};

		return result
	}

	*/



	/*
	constructor() {
		function now(){
			var time = Date.now();
			var last = now.last || time;
			return now.last = time > last ? time : last + 1;
		}

		let pid = process && process.pid ? process.pid.toString(36) : '' ;
		let address = '';
		let mac = '', networkInterfaces = require('os').networkInterfaces();

		for (interface_key in networkInterfaces){
			const networkInterface = networkInterfaces[interface_key];
			const length = networkInterface.length;

			for (let i = 0; i < length; i++){
				if(networkInterface[i].mac && networkInterface[i].mac != '00:00:00:00:00:00') {
					mac = networkInterface[i].mac; break;

				}
			}
		}

		address = mac ? parseInt(mac.replace(/\:|\D+/gi, '')).toString(36) : '' ;
	}
	*/
}
