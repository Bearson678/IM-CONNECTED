describe('Account Creation E2E', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')

    // getting to sign up page
    cy.get('[href="/signup"] > .top-button').click();

    // signing up
    cy.get('.signup-form > :nth-child(2) > .form-input').type('ky');
    cy.get(':nth-child(3) > .form-input').type('etherealky77');
    cy.get('.phone-input').type('9178 2612');
    cy.get(':nth-child(5) > .form-input').type('nennamequannu-2632@yopmail.com');
    cy.get(':nth-child(1) > .form-input').type('Password!');
    cy.get('.password-row > :nth-child(2) > .form-input').type('Password!');
    cy.get('.signup-button').click();

    // auth page for otp
    cy.get('.auth-code-inputs > :nth-child(1)').type('1');
    cy.get('.auth-code-inputs > :nth-child(2)').type('8');
    cy.get('.auth-code-inputs > :nth-child(3)').type('3');
    cy.get('.auth-code-inputs > :nth-child(4)').type('2');
    cy.get('.auth-code-inputs > :nth-child(5)').type('6');
    cy.get('.auth-code-inputs > :nth-child(6)').type('7');
    cy.get('.auth-signup-button').click();

    // preferences page
    cy.get('.language-options > :nth-child(1)').click();
    cy.get('[style="font-size: 16px;"]').click();
    cy.get(':nth-child(1) > .mode-preview > .preview-image').click();
    cy.get('.topics-grid > :nth-child(1) > :nth-child(1)').click();
    cy.get(':nth-child(2) > :nth-child(4) > .topic-text').click();
    cy.get('.continue-btn').click();
  })
})