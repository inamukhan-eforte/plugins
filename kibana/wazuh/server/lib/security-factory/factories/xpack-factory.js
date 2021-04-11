"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XpackFactory = void 0;
class XpackFactory {
    constructor(server) {
        this.server = server;
    }
    async getCurrentUser(req) {
        try {
            const authInfo = await this.server.newPlatform.setup.plugins.security.authc.getCurrentUser(req);
            if (!authInfo)
                return { username: 'elastic' };
            return authInfo;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.XpackFactory = XpackFactory;
