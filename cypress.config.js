const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const fs = require("fs");

module.exports = defineConfig({
  e2e: {
    video: true,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        lighthouse: lighthouse(),
        saveMetrics(data) {
          const filePath = "cypress/fixtures/lighthouse-metrics.json";
          let history = [];
          if (fs.existsSync(filePath)) {
            try {
              const content = fs.readFileSync(filePath, "utf8");
              history = JSON.parse(content);
            } catch (e) {
              history = [];
            }
          }
          history.push(data);
          fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
          return null;
        }
      });
    },
  },
});