"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerJob = void 0;
const predefined_jobs_1 = require("./predefined-jobs");
const wazuh_hosts_1 = require("../../controllers/wazuh-hosts");
const index_1 = require("./index");
const error_handler_1 = require("./error-handler");
const configured_jobs_1 = require("./configured-jobs");
class SchedulerJob {
    constructor(jobName, server) {
        this.jobName = jobName;
        this.server = server;
        this.wazuhHosts = new wazuh_hosts_1.WazuhHostsCtrl();
        this.saveDocument = new index_1.SaveDocument(server);
    }
    async run() {
        const { index, status } = configured_jobs_1.configuredJobs({})[this.jobName];
        if (!status) {
            return;
        }
        try {
            const hosts = await this.getApiObjects();
            const data = await hosts.reduce(async (acc, host) => {
                const { status } = configured_jobs_1.configuredJobs({ host, jobName: this.jobName })[this.jobName];
                if (!status)
                    return acc;
                const response = await this.getResponses(host);
                const accResolve = await Promise.resolve(acc);
                return [
                    ...accResolve,
                    ...response,
                ];
            }, Promise.resolve([]));
            !!data.length && await this.saveDocument.save(data, index);
        }
        catch (error) {
            error_handler_1.ErrorHandler(error, this.server);
        }
    }
    async getApiObjects() {
        const { apis } = predefined_jobs_1.jobs[this.jobName];
        const hosts = await this.wazuhHosts.getHostsEntries(false, false, false);
        if (!hosts.length)
            throw { error: 10001, message: 'No Wazuh host configured in wazuh.yml' };
        if (apis && apis.length) {
            return this.filterHosts(hosts, apis);
        }
        return hosts;
    }
    filterHosts(hosts, apis) {
        const filteredHosts = hosts.filter(host => apis.includes(host.id));
        if (filteredHosts.length <= 0) {
            throw { error: 10002, message: 'No host was found with the indicated ID' };
        }
        return filteredHosts;
    }
    async getResponses(host) {
        const { request, params } = predefined_jobs_1.jobs[this.jobName];
        const data = [];
        if (typeof request === 'string') {
            const apiRequest = new index_1.ApiRequest(request, host, params);
            const response = await apiRequest.getData();
            data.push({ ...response, apiName: host.id });
        }
        else {
            await this.getResponsesForIRequest(host, data);
        }
        return data;
    }
    async getResponsesForIRequest(host, data) {
        const { request, params } = predefined_jobs_1.jobs[this.jobName];
        const fieldName = this.getParamName(typeof request !== 'string' && request.request);
        const paramList = await this.getParamList(fieldName, host);
        for (const param of paramList) {
            const paramRequest = typeof request !== 'string' && request.request.replace(/\{.+\}/, param);
            const apiRequest = !!paramRequest && new index_1.ApiRequest(paramRequest, host, params);
            const response = apiRequest && await apiRequest.getData() || {};
            data.push({
                ...response,
                apiName: host.id,
                [fieldName]: param,
            });
        }
    }
    getParamName(request) {
        const regexResult = /\{(?<fieldName>.+)\}/.exec(request);
        if (regexResult === null)
            throw { error: 10003, message: `The parameter is not found in the Request: ${request}` };
        // @ts-ignore
        const { fieldName } = regexResult.groups;
        if (fieldName === undefined || fieldName === '')
            throw { error: 10004, message: `Invalid field in the request: {request: ${request}, field: ${fieldName}}` };
        return fieldName;
    }
    async getParamList(fieldName, host) {
        const { request } = predefined_jobs_1.jobs[this.jobName];
        // @ts-ignore
        const apiRequest = new index_1.ApiRequest(request.params[fieldName].request, host);
        const response = await apiRequest.getData();
        const { affected_items } = response['data'];
        if (affected_items === undefined || affected_items.lenght === 0)
            throw { error: 10005, message: `Empty response when tried to get the parameters list: ${JSON.stringify(response)}` };
        const values = affected_items.map(this.mapParamList);
        return values;
    }
    mapParamList(item) {
        if (typeof item !== 'object') {
            return item;
        }
        const keys = Object.keys(item);
        if (keys.length > 1 || keys.length < 0)
            throw { error: 10006, message: `More than one key or none were obtained: ${keys}` };
        return item[keys[0]];
    }
}
exports.SchedulerJob = SchedulerJob;
