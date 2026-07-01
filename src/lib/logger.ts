import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { logDir } from "./env";

const logger = createLogger({
    format: format.simple(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console(),
        new DailyRotateFile({ filename: "aegea.%DATE%.log", dirname: logDir, maxFiles: 15 }),
    ]
});

export const log = logger.log;
