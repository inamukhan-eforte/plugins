"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const index_1 = require("./index");
const wazuh_hosts_1 = require("../../controllers/wazuh-hosts");
jest.mock('../../controllers/wazuh-hosts');
jest.mock('./save-document');
jest.mock('./predefined-jobs', () => ({
    jobs: {
        testJob1: {
            status: true,
            method: 'GET',
            request: '/manager/status',
            params: {},
            interval: '* */2 * * *',
            index: 'manager-status',
        },
        testJob2: {
            status: true,
            method: 'GET',
            request: '/manager/status',
            params: {},
            interval: '* */2 * * *',
            index: 'manager-status',
        }
    }
}));
describe('SchedulerJob', () => {
    const oneApi = [{
            url: 'https://localhost',
            port: 55000,
            username: 'wazuh',
            password: 'wazuh',
            id: 'default',
            cluster_info: {
                status: 'disabled',
                manager: 'master',
                node: 'node01',
                cluster: 'Disabled'
            }
        }];
    const twoApi = [
        {
            url: 'https://localhost',
            port: 55000,
            username: 'wazuh',
            password: 'wazuh',
            id: 'internal',
            cluster_info: {
                status: 'disabled',
                manager: 'master',
                node: 'node01',
                cluster: 'Disabled'
            }
        },
        {
            url: 'https://externalhost',
            port: 55000,
            username: 'wazuh',
            password: 'wazuh',
            id: 'external',
            cluster_info: {
                status: 'disabled',
                manager: 'master',
                node: 'node01',
                cluster: 'Disabled'
            }
        },
    ];
    const threeApi = [
        {
            url: 'https://localhost',
            port: 55000,
            username: 'wazuh',
            password: 'wazuh',
            id: 'internal',
            cluster_info: {
                status: 'disabled',
                manager: 'master',
                node: 'node01',
                cluster: 'Disabled'
            }
        },
        {
            url: 'https://externalhost',
            port: 55000,
            username: 'wazuh',
            password: 'wazuh',
            id: 'external',
            cluster_info: {
                status: 'disabled',
                manager: 'master',
                node: 'node01',
                cluster: 'Disabled'
            }
        },
        {
            url: 'https://externalhost',
            port: 55000,
            username: 'wazuh',
            password: 'wazuh',
            id: 'experimental',
            cluster_info: {
                status: 'disabled',
                manager: 'master',
                node: 'node01',
                cluster: 'Disabled'
            }
        },
    ];
    let schedulerJob;
    beforeEach(() => {
        schedulerJob = new index_1.SchedulerJob('testJob1', {});
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should job is assigned ', () => {
        expect(schedulerJob).toBeInstanceOf(index_1.SchedulerJob);
        expect(schedulerJob.jobName).toEqual('testJob1');
    });
    it('should get API object when no specified the `apis` parameter on the job object', async () => {
        wazuh_hosts_1.WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(oneApi);
        const apis = await schedulerJob.getApiObjects();
        expect(apis).not.toBeUndefined();
        expect(apis).not.toBeFalsy();
        expect(apis).toEqual(oneApi);
    });
    it('should get all API objects when no specified the `apis` parameter on the job object', async () => {
        wazuh_hosts_1.WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(twoApi);
        const apis = await schedulerJob.getApiObjects();
        expect(apis).not.toBeUndefined();
        expect(apis).not.toBeFalsy();
        expect(apis).toEqual(twoApi);
    });
    it('should get one of two API object when specified the id in `apis` parameter on the job object', async () => {
        wazuh_hosts_1.WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(twoApi);
        index_1.jobs[schedulerJob.jobName] = { ...index_1.jobs[schedulerJob.jobName], apis: ['internal'] };
        const apis = await schedulerJob.getApiObjects();
        const filteredTwoApi = twoApi.filter(item => item.id === 'internal');
        expect(apis).not.toBeUndefined();
        expect(apis).not.toBeFalsy();
        expect(apis).toEqual(filteredTwoApi);
    });
    it('should get two of three API object when specified the id in `apis` parameter on the job object', async () => {
        wazuh_hosts_1.WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(threeApi);
        const selectedApis = ['internal', 'external'];
        index_1.jobs[schedulerJob.jobName] = { ...index_1.jobs[schedulerJob.jobName], apis: selectedApis };
        const apis = await schedulerJob.getApiObjects();
        const filteredThreeApi = threeApi.filter(item => selectedApis.includes(item.id));
        expect(apis).not.toBeUndefined();
        expect(apis).not.toBeFalsy();
        expect(apis).toEqual(filteredThreeApi);
    });
    it('should throw an exception when no get APIs', async () => {
        wazuh_hosts_1.WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue([]);
        await expect(schedulerJob.getApiObjects()).rejects.toEqual({ error: 10001, message: 'No Wazuh host configured in wazuh.yml' });
    });
    it('should throw an exception when no match API', async () => {
        wazuh_hosts_1.WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(threeApi);
        index_1.jobs[schedulerJob.jobName] = { ...index_1.jobs[schedulerJob.jobName], apis: ['unkown'] };
        await expect(schedulerJob.getApiObjects()).rejects.toEqual({ error: 10002, message: 'No host was found with the indicated ID' });
    });
});
