
const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const fs = require("fs");

// URL de conexión con Google Sheets
const GOOGLE_SHEETS_URL = "https://script.google.com/a/macros/autonoma.edu.co/s/AKfycbyufQO54JuVrAvzHV08fR4-kvx7WTW_laXiyZAXAysROCLfjRWpbfSluQ8YTXmfYweZ/exec";

module.exports = defineConfig({
  e2e: {
    video: true,

    setupNodeEvents(on, config) {

      // Preparar el navegador para Lighthouse
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {

        // Tarea de Lighthouse
        lighthouse: lighthouse(),

        // Guardar métricas y enviarlas a Google Sheets
        async saveMetrics(data) {

          const filePath = "cypress/fixtures/lighthouse-metrics.json";

          let history = [];

          // Leer el historial existente
          if (fs.existsSync(filePath)) {
            try {
              const content = fs.readFileSync(filePath, "utf8");
              history = JSON.parse(content);

              if (!Array.isArray(history)) {
                history = [];
              }

            } catch (error) {
              history = [];
            }
          }

          // Agregar el nuevo registro
          history.push(data);

          // Guardar el historial en JSON
          fs.writeFileSync(
            filePath,
            JSON.stringify(history, null, 2)
          );

          console.log("Métricas guardadas en JSON correctamente.");

          // Enviar el registro a Google Sheets
          try {

            const response = await fetch(GOOGLE_SHEETS_URL, {
              method: "POST",
              headers: {
                "Content-Type": "text/plain;charset=utf-8"
              },
              body: JSON.stringify(data),
              redirect: "follow"
            });

            const resultado = await response.text();

            if (!response.ok) {
              throw new Error(
                `Error HTTP ${response.status}: ${resultado}`
              );
            }

            console.log("Métricas enviadas a Google Sheets.");
            console.log("Respuesta:", resultado);

          } catch (error) {

            console.error(
              "No se pudieron enviar las métricas a Google Sheets:",
              error.message
            );

          }

          return null;
        }

      });

      return config;
    }
  }
});
