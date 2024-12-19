describe('Responsive Test for Spotify Login Page', () => {

  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('should display correctly on a large screen', () => {
    cy.viewport(1280, 800); // Large screen size 

    cy.get('.logo').should('be.visible');
    cy.get('.button').should('be.visible');
    cy.get('.intro').should('be.visible');
  });

  it('should display correctly on a tablet screen', () => {
    cy.viewport(768, 1024); // Tablet screen size 

    cy.get('.logo').should('be.visible');
    cy.get('.button').should('be.visible');
    cy.get('.intro').should('be.visible');
  });

  it('should display correctly on a mobile screen', () => {
    cy.viewport(375, 667); // Mobile screen size

    cy.get('.logo').should('be.visible');
    cy.get('.button').should('be.visible');
    cy.get('.intro').should('be.visible');
  });

  it('should hide some elements or adjust layout on a small screen', () => {
    cy.viewport(320, 480);

    cy.get('.logo').should('be.visible');
    cy.get('.button').should('be.visible');
    cy.get('.intro').should('be.visible');
  });

});
