"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
jest.mock('axios');
describe('ApiRequest', () => {
    const apiExample1 = {
        id: 'default',
        user: 'wazuh',
        password: 'wazuh',
        url: 'http://localhost',
        port: 55000,
        cluster_info: {
            manager: 'master',
            cluster: 'Disabled',
            status: 'disabled',
        },
    };
    afterEach(() => {
        jest.resetAllMocks();
    });
    test('should return the object with the data of the request ', async () => {
        const mockResponse = {
            data: { "enabled": "yes", "running": "yes" },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        };
        axios_1.default.mockResolvedValue(mockResponse);
        const apiRequest = new index_1.ApiRequest('/cluster/status', apiExample1);
        const response = await apiRequest.getData();
        expect(response).toEqual(mockResponse.data);
    });
    test('should return the object with the error when the path is invalid', async () => {
        const mockResponse = {
            response: {
                data: {
                    "type": "about:blank",
                    "title": "Not Found",
                    "detail": "Nothing matches the given URI",
                    "status": 404
                },
                status: 404,
                statusText: 'Not Found',
                headers: {},
                config: {},
            },
            status: 404
        };
        axios_1.default.mockRejectedValue(mockResponse);
        const apiRequest = new index_1.ApiRequest('/cluster/statu', apiExample1);
        try {
            await apiRequest.getData();
        }
        catch (error) {
            expect(error).toEqual({ error: 404, message: "Nothing matches the given URI" });
        }
    });
    test('should throw an error when the port or url api are invalid', async () => {
        const mockResponse = { response: { data: { detail: 'ECONNREFUSED' }, status: 500 } };
        axios_1.default.mockRejectedValue(mockResponse);
        const apiRequest = new index_1.ApiRequest('/cluster/status', apiExample1);
        try {
            await apiRequest.getData();
        }
        catch (error) {
            expect(error).toStrictEqual({ error: 3005, message: 'Wazuh API is not reachable. Please check your url and port.' });
        }
    });
    test('should throw an error when the url api are invalid', async () => {
        const mockResponse = { response: { data: { detail: 'ECONNRESET' }, status: 500 } };
        axios_1.default.mockRejectedValue(mockResponse);
        const apiRequest = new index_1.ApiRequest('/cluster/status', apiExample1);
        try {
            await apiRequest.getData();
        }
        catch (error) {
            expect(error).toStrictEqual({ error: 3005, message: 'Wrong protocol being used to connect to the Wazuh API' });
        }
    });
});
