"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const elasticsearch_1 = __importDefault(require("elasticsearch"));
jest.mock('elasticsearch');
describe('SaveDocument', () => {
    const fakeServer = {
        plugins: {
            elasticsearch: {
                getCluster: data => {
                    return {
                        clusterClient: { client: new elasticsearch_1.default.Client({}) },
                        callWithRequest: Function,
                        callWithInternalUser: Function,
                    };
                }
            }
        }
    };
    let savedDocument;
    beforeEach(() => {
        savedDocument = new index_1.SaveDocument(fakeServer);
    });
    test('should be create the object SavedDocument', () => {
        expect(savedDocument).toBeInstanceOf(index_1.SaveDocument);
    });
});
