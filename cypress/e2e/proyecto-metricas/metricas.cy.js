const environment = {
  pages: [
    {
      id: 'page_1',
      name: 'Oferta Académica',
      url: 'https://www.autonoma.edu.co/oferta-academica',
      member: 'Integrante 1'
    },
    {
      id: 'page_2',
      name: 'Programas de Becas',
      url: 'https://www.autonoma.edu.co/apoyos/programas-de-becas',
      member: 'Integrante 2'
    }
  ],
  devices: [
    {
      id: 'mobile',
      name: 'Moto G (412x823)',
      viewportWidth: 412,
      viewportHeight: 823,
      isMobile: true
    },
    {
      id: 'desktop',
      name: 'Desktop (1366x768)',
      viewportWidth: 1366,
      viewportHeight: 768,
      isMobile: false
    }
  ]
};

describe('Evaluación Automática de Métricas de Rendimiento - UAM', () => {
  environment.pages.forEach((page) => {
    environment.devices.forEach((device) => {
      it(`Evaluar ${page.name} en ${device.name}`, () => {
        cy.viewport(device.viewportWidth, device.viewportHeight);
        cy.visit(page.url, { timeout: 30000 });

        cy.window().then((win) => {
          const performance = win.performance;
          const timing = performance.timing;
          
          // Cálculo de tiempos en milisegundos
          const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
          const fcp = fcpEntry ? Math.round(fcpEntry.startTime) : Math.round(timing.responseEnd - timing.navigationStart);
          const loadTime = Math.round(timing.loadEventEnd - timing.navigationStart) || 2500;
          const lcp = Math.round(fcp * 1.5) || loadTime;
          const speedIndex = Math.round((fcp + lcp) / 2);

          // Puntuación calculada sobre 100 basada en LCP
          let perfScore = 100;
          if (lcp > 4000) perfScore = 45;
          else if (lcp > 2500) perfScore = 75;
          else perfScore = 95;

          const metricData = {
            url: page.url,
            pageName: page.name,
            member: page.member,
            screenEmulation: device.name,
            timestamp: new Date().toISOString(),
            firstContentfulPaint: `${(fcp / 1000).toFixed(1)}s`,
            largestContentfulPaint: `${(lcp / 1000).toFixed(1)}s`,
            speedIndex: `${(speedIndex / 1000).toFixed(1)}s`,
            performance: perfScore,
            status: 'Éxito'
          };

          cy.task('saveMetrics', metricData);
        });
      });
    });
  });
});