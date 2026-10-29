describe('Prueba de Automatización de Login', () => {
  it('Debe ingresar a la página de login y realizar la verificación', () => {
    // 1. Visitar la página de login
    cy.visit('https://practicetestautomation.com/practice-test-login/');
    cy.screenshot('1-pagina-inicial');

    // 2. Ingresar credenciales
    cy.get('#username').type('student');
    cy.get('#password').type('Password123');
    cy.get('#submit').click();

    // 3. Verificar login exitoso
    cy.url().should('include', '/logged-in-successfully/');
    cy.contains('Logged In Successfully').should('be.visible');
    cy.screenshot('2-login-exitoso');

    // 4. Cerrar sesión para redirigir de nuevo al login
    cy.contains('Log out').click();

    // 5. Verificar redirección al login
    cy.url().should('include', '/practice-test-login/');
    cy.screenshot('3-redireccion-login');
  });
});