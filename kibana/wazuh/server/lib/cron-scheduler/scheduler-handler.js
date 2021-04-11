"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerHandler = void 0;
const index_1 = require("./index");
const configured_jobs_1 = require("./configured-jobs");
const node_cron_1 = require("node-cron");
class SchedulerHandler {
    constructor(server) {
        this.server = server;
        this.schedulerJobs = [];
    }
    run() {
        for (const job in configured_jobs_1.configuredJobs({})) {
            const schedulerJob = new index_1.SchedulerJob(job, this.server);
            this.schedulerJobs.push(schedulerJob);
            const task = node_cron_1.schedule(index_1.jobs[job].interval, () => schedulerJob.run());
        }
    }
}
exports.SchedulerHandler = SchedulerHandler;
