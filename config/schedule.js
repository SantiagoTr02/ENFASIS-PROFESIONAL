const cron = require('cron');
const { exec } = require('child_process');

// Configuración de los Jobs Programados para la UAM (Zona Horaria America/Bogota)
const jobs = [
  {
    name: 'Ejecución Móvil Diaria',
    schedule: '0 8 * * *', // Todos los días a las 8:00 AM
    command: 'npx cypress run --spec "cypress/e2e/proyecto-metricas/metricas.cy.js"'
  },
  {
    name: 'Ejecución Escritorio Semanal',
    schedule: '0 9 * * 1', // Cada lunes a las 9:00 AM
    command: 'npx cypress run --spec "cypress/e2e/proyecto-metricas/metricas.cy.js"'
  }
];

console.log(' Programador de pruebas de rendimiento iniciado (America/Bogota)...');

// Instanciar los jobs con node-cron
jobs.forEach(job => {
  const cronJob = new cron.CronJob(job.schedule, () => {
    console.log(`\n Ejecutando job: ${job.name}...`);
    exec(job.command, (error, stdout, stderr) => {
      if (error) {
        console.error(` Error en ${job.name}:`, error.message);
        return;
      }
      console.log(` ${job.name} completado con éxito.\n`, stdout);
    });
  }, null, true, 'America/Bogota');

  console.log(` Job registrado: [${job.name}] - Expresión Cron: '${job.schedule}'`);
});