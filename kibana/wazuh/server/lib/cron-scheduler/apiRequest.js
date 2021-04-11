"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRequest = void 0;
const api_interceptor_js_1 = require("../api-interceptor.js");
class ApiRequest {
    constructor(request, api, params = {}) {
        this.request = request;
        this.api = api;
        this.params = params;
        this.apiInterceptor = new api_interceptor_js_1.ApiInterceptor();
    }
    async makeRequest() {
        const { id, url, port } = this.api;
        const response = await this.apiInterceptor.request('GET', `${url}:${port}/${this.request}`, this.params, { idHost: id });
        return response;
    }
    async getData() {
        try {
            const response = await this.makeRequest();
            if (response.status !== 200)
                throw response;
            return response.data;
        }
        catch (error) {
            if (error.status === 404) {
                throw { error: 404, message: error.data.detail };
            }
            if (error.response && error.response.status === 401) {
                throw { error: 401, message: 'Wrong Wazuh API credentials used' };
            }
            if (error && error.data && error.data.detail && error.data.detail === 'ECONNRESET') {
                throw { error: 3005, message: 'Wrong protocol being used to connect to the Wazuh API' };
            }
            if (error && error.data && error.data.detail && ['ENOTFOUND', 'EHOSTUNREACH', 'EINVAL', 'EAI_AGAIN', 'ECONNREFUSED'].includes(error.data.detail)) {
                throw { error: 3005, message: 'Wazuh API is not reachable. Please check your url and port.' };
            }
            throw error;
        }
    }
}
exports.ApiRequest = ApiRequest;
