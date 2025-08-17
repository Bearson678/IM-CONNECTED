describe('chatbot use case 7', () => {

  beforeEach(() => {
    // Spy only, pass-through to real server
    cy.intercept('GET', 'http://localhost:5001/api/v1/user/threadId').as('requestThreadId');
    cy.intercept('POST', 'http://localhost:3000/api/assistants/threads/thread_pZoZ1n1B5b2zDgO0itJrksB3/messages').as('postMessage');
  });

  it('use case 7: translate foreign text', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[href="/login"] > .top-button').click();
    cy.get(':nth-child(2) > .form-input').clear('R');
    cy.get(':nth-child(2) > .form-input').type('Ryou');
    cy.get(':nth-child(3) > .form-input').clear('P');
    cy.get(':nth-child(3) > .form-input').type('Password!');
    cy.get('.login-button').click();
    cy.wait(2000);
    cy.get(':nth-child(4) > .applicationIcon').click();
    cy.wait(2000);
    cy.get('.input').clear('T');
    cy.get('.input').type('Translate this to english \'Hola\'.');
    cy.get('.button > img').click();

    cy.wait('@postMessage').its('response.statusCode').should('eq', 200);
    cy.wait('@requestThreadId').its('response.statusCode').should(
      (code) => {
      // 304 (cached) response
      expect([200, 304]).to.include(code);
    });

    cy.wait(6000);
    cy.get('div.assistantBubble').should('exist');
    cy.get('div.userBubble').should('exist');
    cy.contains("Translate this to english 'Hola'.").should('be.visible'); 
  });
})