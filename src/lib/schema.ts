import { sql } from "drizzle-orm";
import { sqliteTable, text, int, check, primaryKey } from "drizzle-orm/sqlite-core";

export const intervalTypeTable = sqliteTable("interval_type", {
    id: int("id").primaryKey({autoIncrement: true}),
    label: text("label").notNull()
});

export const jobTable = sqliteTable("job", {
    id: int("id").primaryKey({autoIncrement: true}),
    guildId: text("guild_id").notNull(),
    channelId: text("channel_id").notNull(),
    userId: text("user_id").notNull(),
    timestamp: int("timestamp").notNull(),
    tagList: text("tag_list").notNull(),
    intervalType: int("interval_type_id").notNull().references(() => intervalTypeTable.id),
    intervalSeconds: int("interval_seconds"),
    intervalCron: text("interval_cron"),
    message: text("message").notNull().default("")
}, (table) => [
    check("one_interval_given_check", sql`(${table.intervalSeconds} IS NOT NULL AND ${table.intervalCron} IS NULL) OR (${table.intervalSeconds} IS NULL AND ${table.intervalCron} IS NOT NULL)`)
]);

export const sentTable = sqliteTable("sent", {
    jobId: int("job_id").references(() => jobTable.id),
    postId: int("post_id"),
}, (table) => [
    primaryKey({columns: [table.jobId, table.postId]})
]);
