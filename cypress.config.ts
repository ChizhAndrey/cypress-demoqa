import { defineConfig } from 'cypress';
import fs from 'fs-extra';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("task", {
                async deleteFolder(folderPath: fs.PathLike) {
                    try {
                        await fs.rmdir(folderPath, {maxRetries: 10, recursive: true });
                        return null;
                    } catch (error) {
                        if (error instanceof Error) {
                            throw new Error(`Failed to delete folder: ${folderPath}. Error: ${error.message}`);
                        } else {
                            throw new Error(`Failed to delete folder: ${folderPath}. Unknown error: ${String(error)}`);
                        }
                    }
                }         
            }),
            on("task", {
                async deleteFolderContents(folderPath: string) {
                    try {
                        await fs.emptyDir(folderPath);
                        return null;
                    } catch (error) {
                        if(error instanceof Error) {
                            throw new Error(`Failed to empty folder: ${folderPath}. Error: ${error.message}`);
                        } else {
                            throw new Error(`Failed to empty folder: ${folderPath}. Error: ${String(error)}`);
                        }
                    }
                }
            }),
            on("task", {
                async writeDataToFile({path, data}: {path: number | fs.PathLike, data: string | NodeJS.ArrayBufferView}) {
                    try {
                        await fs.writeFile(path, data);
                        return null;
                    } catch (error) {
                        if(error instanceof Error) {
                            throw new Error(`Failed to write file: ${path}. Error: ${error.message}`);
                        } else {
                            throw new Error(`Failed to write file: ${path}. Error: ${String(error)}`);
                        }
                    }
                }
            }),
            on("task", {
                async copyFile({src, dst, flags}: {src: fs.PathLike, dst: fs.PathLike, flags?: number}) {
                    try {
                        await fs.copyFile(src, dst, flags);
                        return null;
                    } catch (error) {
                        if(error instanceof Error) {
                            throw new Error(`Failed to copy file from ${src} to ${dst}. Error: ${error.message}`);
                        } else {
                            throw new Error(`Failed to copy file from ${src} to ${dst}. Error: ${String(error)}`);
                        }
                    }
                }
            })

            return config;
        },      
        baseUrl: "https://demoqa.com/",
        viewportHeight: 1080,
        viewportWidth: 1920,
        blockHosts: [
            "www.googletagservices.com",
            "pagead2.googlesyndication.com",
            "stats.g.doubleclick.net",
            "www.google-analytics.com",
        ],
        hideXHRAndFetch: true,
        hideUncaughtExc: true,
        specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
    },
});