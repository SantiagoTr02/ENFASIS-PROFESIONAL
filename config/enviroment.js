module.exports = {
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
  ],
  thresholds: {
    firstContentfulPaint: { good: 1800, moderate: 3000 },
    largestContentfulPaint: { good: 2500, moderate: 4000 },
    speedIndex: { good: 3400, moderate: 5800 },
    performance: { good: 90, moderate: 50 }
  }
};