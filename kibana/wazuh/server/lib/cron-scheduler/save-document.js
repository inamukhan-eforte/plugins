"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveDocument = void 0;
const get_configuration_1 = require("../get-configuration");
const logger_js_1 = require("../../logger.js");
const index_date_js_1 = require("../index-date.js");
const constants_1 = require("../../../util/constants");
class SaveDocument {
    constructor(server) {
        this.logPath = 'cron-scheduler|SaveDocument';
        this.server = server;
        this.callWithRequest = server.plugins.elasticsearch.getCluster('data').callWithRequest;
        this.callWithInternalUser = server.plugins.elasticsearch.getCluster('data').callWithInternalUser;
    }
    async save(doc, indexConfig) {
        const { name, creation, mapping, shards, replicas } = indexConfig;
        const index = this.addIndexPrefix(name);
        const indexCreation = `${index}-${index_date_js_1.indexDate(creation)}`;
        try {
            await this.checkIndexAndCreateIfNotExists(indexCreation, shards, replicas);
            const createDocumentObject = this.createDocument(doc, indexCreation, mapping);
            const response = await this.callWithInternalUser('bulk', createDocumentObject);
            logger_js_1.log(this.logPath, `Response of create new document ${JSON.stringify(response)}`, 'debug');
            await this.checkIndexPatternAndCreateIfNotExists(index);
        }
        catch (error) {
            if (error.status === 403)
                throw { error: 403, message: `Authorization Exception in the index "${index}"` };
            if (error.status === 409)
                throw { error: 409, message: `Duplicate index-pattern: ${index}` };
            throw error;
        }
    }
    async checkIndexAndCreateIfNotExists(index, shards, replicas) {
        try {
            const exists = await this.callWithInternalUser('indices.exists', { index });
            logger_js_1.log(this.logPath, `Index '${index}' exists? ${exists}`, 'debug');
            if (!exists) {
                const response = await this.callWithInternalUser('indices.create', {
                    index,
                    body: {
                        settings: {
                            index: {
                                number_of_shards: shards || constants_1.WAZUH_INDEX_SHARDS,
                                number_of_replicas: replicas || constants_1.WAZUH_INDEX_REPLICAS
                            }
                        }
                    }
                });
                logger_js_1.log(this.logPath, `Status of create a new index: ${JSON.stringify(response)}`, 'debug');
            }
        }
        catch (error) {
            this.checkDuplicateIndexError(error);
        }
    }
    checkDuplicateIndexError(error) {
        const { type } = ((error || {}).body || {}).error || {};
        if (!['resource_already_exists_exception'].includes(type))
            throw error;
    }
    async checkIndexPatternAndCreateIfNotExists(index) {
        const KIBANA_INDEX = this.getKibanaIndex();
        logger_js_1.log(this.logPath, `Internal index of kibana: ${KIBANA_INDEX}`, 'debug');
        const result = await this.callWithInternalUser('search', {
            index: KIBANA_INDEX,
            type: '_doc',
            body: {
                query: {
                    match: {
                        _id: `index-pattern:${index}-*`
                    }
                }
            }
        });
        if (result.hits.total.value === 0) {
            await this.createIndexPattern(KIBANA_INDEX, index);
        }
    }
    async createIndexPattern(KIBANA_INDEX, index) {
        try {
            const response = await this.callWithInternalUser('create', {
                index: KIBANA_INDEX,
                type: '_doc',
                'id': `index-pattern:${index}-*`,
                body: {
                    type: 'index-pattern',
                    'index-pattern': {
                        title: `${index}-*`,
                        timeFieldName: 'timestamp',
                    }
                }
            });
            logger_js_1.log(this.logPath, `The indexPattern no exist, response of createIndexPattern: ${JSON.stringify(response)}`, 'debug');
        }
        catch (error) {
            this.checkDuplicateIndexPatterError(error);
        }
    }
    checkDuplicateIndexPatterError(error) {
        const { type } = ((error || {}).body || {}).error || {};
        if (!['version_conflict_engine_exception', 'resource_already_exists_exception'].includes(type))
            throw error;
    }
    getKibanaIndex() {
        return ((((this.server || {})
            // @ts-ignore
            .registrations || {})
            .kibana || {})
            .options || {})
            .index || '.kibana';
    }
    createDocument(doc, index, mapping) {
        const createDocumentObject = {
            index,
            type: '_doc',
            body: doc.flatMap(item => [{
                    index: { _index: index }
                },
                {
                    ...this.buildData(item, mapping),
                    timestamp: new Date(Date.now()).toISOString()
                }
            ])
        };
        logger_js_1.log(this.logPath, `Document object: ${JSON.stringify(createDocumentObject)}`, 'debug');
        return createDocumentObject;
    }
    buildData(item, mapping) {
        const getValue = (key, item) => {
            const keys = key.split('.');
            if (keys.length === 1) {
                return JSON.stringify(item[key]);
            }
            return getValue(keys.slice(1).join('.'), item[keys[0]]);
        };
        if (mapping) {
            const data = mapping.replace(/\${([a-z|A-Z|0-9|\.\-\_]+)}/gi, (...key) => getValue(key[1], item));
            return JSON.parse(data);
        }
        if (typeof item.data === 'object') {
            return item.data;
        }
        return { data: item.data };
    }
    addIndexPrefix(index) {
        const configFile = get_configuration_1.getConfiguration();
        const prefix = configFile['cron.prefix'] || 'wazuh';
        return `${prefix}-${index}`;
    }
}
exports.SaveDocument = SaveDocument;
