
//Cypress cant redirect two times in a test so no redirect to journey page

describe('Spotify Login Flow Test', () => {
  const baseUrl = 'http://localhost:5173'; 

  beforeEach(() => {
    
    cy.visit(baseUrl);
  });

  it('should click the login button and log in to Spotify with credentials', () => {
   
    cy.get('.button').should('be.visible').click();
    cy.origin('https://accounts.spotify.com', () => {

      cy.get('#login-username', { timeout: 1000 }).type(Cypress.env('USERNAME'));
      cy.get('#login-password', { timeout: 1000 }).type(Cypress.env('PASSWORD'));
      
      cy.get('#login-button').click();
    });


  });
});

