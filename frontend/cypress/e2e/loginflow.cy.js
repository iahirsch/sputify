// describe('End-to-End Test for Spotify Login Flow', () => {

//   const baseUrl = 'http://localhost:5173';
//   const spotifyAuthToken = 'mocked-spotify-token';

//   beforeEach(() => {
//     cy.intercept('POST', 'https://accounts.spotify.com/api/token', {
//       statusCode: 200,
//       body: { access_token: spotifyAuthToken },
//     }).as('mockSpotifyLogin');
//   });

//   it('should visit the homepage, simulate login with Spotify, and navigate to the journey page', () => {
//     cy.visit(baseUrl);
//     cy.get('.button').should('be.visible').click();

//     cy.wait('@mockSpotifyLogin').then((interception) => {
//       console.log(interception);
//     });
    
//     cy.url().should('include', '/journey');
//     cy.contains('Your Music Journey').should('be.visible');
//   });
// });