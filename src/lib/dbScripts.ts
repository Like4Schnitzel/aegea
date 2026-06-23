import { createIntervalTypes } from "./intervals";

export async function setupDb() {
    await createIntervalTypes();
}