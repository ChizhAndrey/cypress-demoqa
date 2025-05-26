import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {      
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