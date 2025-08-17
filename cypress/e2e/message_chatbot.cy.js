describe('chatbot use case', () => {
  it('use case 7: translate foreign text', () => {
    cy.visit('http://localhost:5173/');
    cy.get('[href="/login"] > .top-button').click();
    cy.get(':nth-child(2) > .form-input').clear('R');
    cy.get(':nth-child(2) > .form-input').type('Ryou');
    cy.get(':nth-child(3) > .form-input').clear('P');
    cy.get(':nth-child(3) > .form-input').type('Password!');
    cy.get('.login-button').click();
    cy.get(':nth-child(4) > .applicationIcon').click();
    cy.get('.input').clear('T');
    cy.get('.input').type('Translate this to english \'Hola\'.');
    cy.get('.button > img').click();
  })

  it('use case 6: summarize post', function() {
    cy.visit('http://localhost:5173/');
    cy.get('[href="/login"] > .top-button').click();
    cy.get(':nth-child(2) > .form-input').clear('R');
    cy.get(':nth-child(2) > .form-input').type('Ryou');
    cy.get(':nth-child(3) > .form-input').clear('P');
    cy.get(':nth-child(3) > .form-input').type('Password!');
    cy.get('.login-button').click();
    cy.get('.icons > :nth-child(4)').click();
    cy.get('.input').clear('S');
    cy.get('.input').type('Summarize this post for me \'Extreme Stress from being a caregiver, i want to live separately.\'');
    cy.get('.button > img').click();
  });
})