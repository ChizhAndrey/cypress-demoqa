import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    hideXHR: true,
    hideExc: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    baseUrl: "https://demoqa.com/",
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
});
