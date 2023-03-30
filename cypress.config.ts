/// <reference path="cypress/support/index.d.ts" />
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    
    baseUrl: "https://demoqa.com/",
    viewportHeight: 1080,
    viewportWidth: 1920,
    hideXHRAndFetch: true,
    hideExc: true,
  },
});
