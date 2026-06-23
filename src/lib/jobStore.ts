import { db } from "./env"
import { IntervalTypes } from "./intervals"
import { jobTable } from "./schema"

export type Job = {
    type: "seconds"
    secondsDelay: number
    start: number,
    tags: string,
    channelId: string,
    message: string
} | {
    type: "cron"
    cron: string,
    tags: string,
    channelId: string,
    message: string
}

export const jobs: Job[] = [];

export async function loadJobs() {
    const dbJobs = await db.select().from(jobTable);
    for (const job of dbJobs.map((job): Job => {
        if (job.intervalType == IntervalTypes.seconds) {
            return {
                type: "seconds",
                secondsDelay: job.intervalSeconds!,
                start: job.timestamp,
                tags: job.tagList,
                channelId: job.channelId,
                message: job.message
            }
        } else {
            return {
                type: "cron",
                cron: job.intervalCron!,
                tags: job.tagList,
                channelId: job.channelId,
                message: job.message
            }
        }
    })) {
        jobs.push(job);
    }
}
