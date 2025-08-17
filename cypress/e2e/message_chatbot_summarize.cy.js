describe('chatbot use case 6', () => {

  beforeEach(() => {
    // Spy only, pass-through to real server
    cy.intercept('GET', 'http://localhost:5001/api/v1/user/threadId').as('requestThreadId');
    cy.intercept('POST', 'http://localhost:3000/api/assistants/threads/thread_pZoZ1n1B5b2zDgO0itJrksB3/messages').as('postMessage');
    cy.intercept('POST', 'http://localhost:3000/api/assistants/threads/thread_pZoZ1n1B5b2zDgO0itJrksB3/actions').as('postAction');
  });


  it('use case 6: summarize post', function () {
    cy.visit('http://localhost:5173/');
    cy.get('[href="/login"] > .top-button').click();
    cy.get(':nth-child(2) > .form-input').clear('R');
    cy.get(':nth-child(2) > .form-input').type('Ryou');
    cy.get(':nth-child(3) > .form-input').clear('P');
    cy.get(':nth-child(3) > .form-input').type('Password!');
    cy.get('.login-button').click();
    cy.wait(2000);
    cy.get('.icons > :nth-child(4)').click();
    cy.wait(2000);
    cy.get('.input').clear('S');
    cy.get('.input').type('Summarize this post for me \'Extreme Stress from being a caregiver, i want to live separately.\'');
    cy.get('.button > img').click();

    cy.wait('@postMessage').its('response.statusCode').should('eq', 200);
    cy.wait('@requestThreadId').its('response.statusCode').should(
      (code) => {
      // 304 (cached) response
      expect([200, 304]).to.include(code);
    });
    cy.wait('@postAction').its('response.statusCode').should('eq', 200);
    

    cy.wait(6000);
    cy.get('div.assistantBubble').should('exist');
    cy.get('div.userBubble').should('exist');
    cy.contains("Summarize this post for me \'Extreme Stress from being a caregiver, i want to live separately.\'").should('be.visible'); 
  });
})