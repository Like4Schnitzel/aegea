import { db } from "./env";
import { intervalTypeTable } from "./schema";

type Interval = typeof intervalTypeTable.$inferInsert;

export enum IntervalTypes {
    "cron",
    "seconds"
}

export const intervalTypes: Interval[] = [
    {
        id: IntervalTypes.cron,
        label: "cron"
    },
    {
        id: IntervalTypes.seconds,
        label: "seconds"
    }
];

export async function createIntervalTypes() {
    for (const interval of intervalTypes) {
        await db.insert(intervalTypeTable).values(interval).onConflictDoNothing();
    }
}
