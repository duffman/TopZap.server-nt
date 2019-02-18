"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ZynRemoteIp {
    /*
    private getIpInfo(ip: string): string {
        // IPV6 addresses can include IPV4 addresses
        // So req.ip can be '::ffff:86.3.182.58'
        // However geoip-lite returns null for these
        if (ip.includes('::ffff:')) {
            ip = ip.split(':').reverse()[0]
        }

        //var lookedUpIP = geoip.lookup(ip);
        if ((ip === '127.0.0.1' || ip === '::1')) {
            return {error:"This won't work on localhost"}
        }

        if (!lookedUpIP){
            return { error: "Error occured while trying to process the information" }
        }

        return lookedUpIP;
    }

    public static getIpInfoMiddleware(req: Request): string {
        //let xForwardedFor = (req.headers['x-forwarded-for'] || "").replace(/:\d+$/, '');
        //return xForwardedFor || req.conn.remoteAddress;
    }
    */
    static getRemoteIp(req) {
        return req.connection.remoteAddress;
    }
}
exports.ZynRemoteIp = ZynRemoteIp;
