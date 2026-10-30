
const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const fs = require("fs");
const path = require("path");

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyufQO54JuVrAvzHV08fR4-kvx7WTW_laXiyZAXAysROCLfjRWpbfSluQ8YTXmfYweZ/exec";

module.exports = defineConfig({
  e2e: {
    video: true,

    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        lighthouse: lighthouse(),

        async saveMetrics(data) {
          const filePath = path.join(
            __dirname,
            "cypress",
            "fixtures",
            "lighthouse-metrics.json"
          );

          fs.mkdirSync(path.dirname(filePath), { recursive: true });

          let history = [];

          if (fs.existsSync(filePath)) {
            try {
              history = JSON.parse(
                fs.readFileSync(filePath, "utf8")
              );

              if (!Array.isArray(history)) {
                history = [];
              }
            } catch (error) {
              history = [];
            }
          }

          // Guardar primero el registro local
          history.push(data);

          fs.writeFileSync(
            filePath,
            JSON.stringify(history, null, 2),
            "utf8"
          );

          console.log("Métrica guardada localmente.");

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

            const texto = await response.text();

            if (!response.ok) {
              throw new Error(
                `Error HTTP ${response.status}: ${texto}`
              );
            }

            let resultado;

            try {
              resultado = JSON.parse(texto);
            } catch (error) {
              throw new Error(
                "Respuesta no válida de Google: " + texto.substring(0, 500)
              );
            }

            if (resultado.success !== true) {
              throw new Error(
                resultado.error || "Google no confirmó el guardado."
              );
            }

            console.log("Métrica enviada correctamente a Google Sheets.");

            return null;

          } catch (error) {
            console.error("Error enviando a Google Sheets:", error.message);
            throw error;
          }
        }
      });

      return config;
    }
  }
});
