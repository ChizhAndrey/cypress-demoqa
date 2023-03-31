/// <reference path="cypress/support/index.d.ts" />
import { defineConfig } from "cypress";
import fs from "fs/promises";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                async deleteFolder(folderPath) {
                    await fs.rmdir(folderPath, {maxRetries: 10, recursive: true })
                    return null;
                }         
            })
        },
        
        baseUrl: "https://demoqa.com/",
        viewportHeight: 1080,
        viewportWidth: 1920,
        hideXHRAndFetch: true,
        hideExc: true,
    },
});
