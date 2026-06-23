import { db } from "./env"
import { intervalTypes, IntervalTypes } from "./intervals"
import { jobTable } from "./schema"

export type Job = typeof jobTable.$inferSelect;
export const jobs: Job[] = [];

export async function loadJobs() {
    const dbJobs = await db.select().from(jobTable);
    jobs.push(...dbJobs);
}
