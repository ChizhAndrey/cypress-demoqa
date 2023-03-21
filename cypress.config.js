const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    baseUrl: "https://demoqa.com/",
    hideXHR: true,
    hideExc: true,
    viewportHeight: 1080,
    viewportWidth: 1920
  },
});
