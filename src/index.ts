import { setFailed } from "@actions/core";
import process from "./process";

async function run(): Promise<void> {
    try {
        await process();
    } catch (error) {
        setFailed((error as Error)?.message);
    }
}

void run();
