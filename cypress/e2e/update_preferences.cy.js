describe('Update Preferences E2E', () => {
  it('passes', () => {
    cy.visit('localhost:5173')

    // getting to login page
    cy.get('[href="/login"] > .top-button').click();

    // entering credentials
    cy.get(':nth-child(2) > .form-input').type('ethereal77');
    cy.get(':nth-child(3) > .form-input').type('Password!');
    cy.get('.login-button').click();

    // getting to profile page
    cy.get(':nth-child(5) > .applicationIcon').click();

    // changing preferences (language, text size, content mode)
    cy.get(':nth-child(1) > .preference-options > :nth-child(2)').click();
    cy.get(':nth-child(2) > .preference-options > :nth-child(3)').click();
    cy.get(':nth-child(3) > .preference-options > :nth-child(1)').click();
  })
})