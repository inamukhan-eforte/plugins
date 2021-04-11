"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpendistroFactory = void 0;
class OpendistroFactory {
    constructor(server) {
        this.server = server;
    }
    async getCurrentUser(req) {
        try {
            const elasticRequest = this.server.plugins.elasticsearch.getCluster('data');
            const params = {
                path: `_opendistro/_security/api/account`,
                method: 'GET',
            };
            const data = await elasticRequest.callWithRequest(req, 'transport.request', params);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.OpendistroFactory = OpendistroFactory;
