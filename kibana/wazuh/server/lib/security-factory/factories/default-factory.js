"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFactory = void 0;
class DefaultFactory {
    constructor(server) {
        this.server = server;
    }
    async getCurrentUser(req) {
        try {
            return { username: 'elastic' };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.DefaultFactory = DefaultFactory;
