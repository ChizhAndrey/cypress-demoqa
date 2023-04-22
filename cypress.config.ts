/// <reference path="cypress/support/index.d.ts" />
import { defineConfig } from "cypress";
import fs from "fs-extra";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                async deleteFolder(folderPath: fs.PathLike) {
                    await fs.rmdir(folderPath, {maxRetries: 10, recursive: true });
                    return null;
                }         
            }),
            on("task", {
                async deleteFolderContents(folderPath: string) {
                    await fs.emptyDir(folderPath);
                    return null;
                }
            }),
            on("task", {
                async writeDataToFile({path, data}: {path: number | fs.PathLike, data: string | NodeJS.ArrayBufferView}) {
                    await fs.writeFile(path, data);
                    return null;
                }
            }),
            on("task", {
                async copyFile({src, dst, flags}: {src: fs.PathLike, dst: fs.PathLike, flags?: number}) {
                    await fs.copyFile(src, dst, flags);
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
