"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = void 0;
exports.jobs = {
    'manager-stats-remoted': {
        status: true,
        method: "GET",
        request: '/manager/stats/remoted?pretty',
        params: {},
        interval: '0 */5 * * * *',
        index: {
            name: 'statistics',
            creation: 'w',
            mapping: '{"remoted": ${data.affected_items}, "apiName": ${apiName}, "cluster": "false"}',
        }
    },
    'manager-stats-analysisd': {
        status: true,
        method: "GET",
        request: '/manager/stats/analysisd?pretty',
        params: {},
        interval: '0 */5 * * * *',
        index: {
            name: 'statistics',
            creation: 'w',
            mapping: '{"analysisd": ${data.affected_items}, "apiName": ${apiName}, "cluster": "false"}',
        }
    },
    'cluster-stats-remoted': {
        status: true,
        method: "GET",
        request: {
            request: '/cluster/{nodeName}/stats/remoted?pretty',
            params: {
                nodeName: {
                    request: '/cluster/nodes?select=name'
                }
            }
        },
        params: {},
        interval: '0 */5 * * * *',
        index: {
            name: 'statistics',
            creation: 'w',
            mapping: '{"remoted": ${data.affected_items}, "apiName": ${apiName}, "nodeName": ${nodeName}, "cluster": "true"}',
        }
    },
    'cluster-stats-analysisd': {
        status: true,
        method: "GET",
        request: {
            request: '/cluster/{nodeName}/stats/analysisd?pretty',
            params: {
                nodeName: {
                    request: '/cluster/nodes?select=name'
                }
            }
        },
        params: {},
        interval: '0 */5 * * * *',
        index: {
            name: 'statistics',
            creation: 'w',
            mapping: '{"analysisd": ${data.affected_items}, "apiName": ${apiName}, "nodeName": ${nodeName}, "cluster": "true"}',
        }
    },
};
