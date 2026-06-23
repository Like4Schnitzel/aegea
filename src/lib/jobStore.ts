import { Client } from "discord.js";
import { db } from "./env"
import { intervalTypes, IntervalTypes } from "./intervals"
import { sendPost } from "./post";
import { jobTable } from "./schema"

export type Job = typeof jobTable.$inferSelect;
export type JobTask = {
    timeout: NodeJS.Timeout,
    interval: NodeJS.Timeout | null
}

export const jobTasks: JobTask[] = [];

export async function createJobTask(client: Client<true>, job: Job) {
    const callback = () => {
        try {
            sendPost(client, job);
        } catch (e) {
            console.error(e);
        }
    }
    
    if (job.intervalType === IntervalTypes.seconds) {
        const msInterval = job.intervalSeconds! * 1000;
        const msToNextPost = msInterval - (job.timestamp % msInterval);
        const task: JobTask = {
            timeout: setTimeout(() => {
                callback();
                task.interval = setInterval(callback, msInterval);
            }, msToNextPost),
            interval: null,
        }
        jobTasks.push(task);
    } else if (job.intervalType === IntervalTypes.cron) {
        throw Error("Not yet implemented.");
    } else {
        throw Error(`Unknown interval type: ${job.intervalType}`)
    }
}
