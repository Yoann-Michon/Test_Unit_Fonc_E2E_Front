/// <reference types="cypress" />

describe('User Sign Up', () => {
    const userEmail = 'Eva@example.com';
    const existingEmail = 'Jhon.snow@example.com'; // Email existant
  
    beforeEach(() => {
      // Visite la page de signup
      cy.visit('/signup');

       cy.intercept('POST', '/auth/register', (req) => {
        if (req.body.email === existingEmail) {
            // Simuler une réponse avec un code 500 pour un email déjà existant
            req.reply({
                statusCode: 500,
                body: {
                    error: 'Email already exists',
                },
            });
        } else {
            // Simuler une réponse réussie (code 201) pour d'autres emails
            req.reply({
                statusCode: 201,
                body: {
                    id: '1',
                    email: req.body.email,
                    firstname: 'Eva',
                    lastname: 'Elfie',
                    pseudo: 'Eva_Elfie',
                },
            });
        }
    }).as('createUser');
});
  
  
    it('should sign up with valid information and redirect to signin', () => {
        // Simuler la saisie des informations
        cy.get('input[name="firstname"]').type('Eva');
        cy.get('input[name="lastname"]').type('Elfie');
        cy.get('input[name="pseudo"]').type('Eva_Elfie');
        cy.get('input[name="email"]').type(userEmail);
        cy.get('input[name="password"]').type('EvaElfie1234.');
    
        // Soumettre le formulaire
        cy.get('button[type="submit"]').click();
    
        // Vérifier la redirection ou l'apparition d'un message de bienvenue
        cy.url().should('include', '/signin');
      });
  
    it('should display an error for missing first name', () => {
      // Leave first name empty
      cy.get('input[name="lastname"]').type('Elfie');
      cy.get('input[name="pseudo"]').type('Eva_Elfie');
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type('EvaElfie1234.');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that an error message for first name appears
      cy.contains('Veuillez renseigner ce champ.').should('be.visible');
    });
  
    it('should display an error for invalid email', () => {
      // Enter an invalid email
      cy.get('input[name="firstname"]').type('Eva');
      cy.get('input[name="lastname"]').type('Elfie');
      cy.get('input[name="pseudo"]').type('Eva_Elfie');
      cy.get('input[name="email"]').type('Evaexample.com');
      cy.get('input[name="password"]').type('EvaElfie1234.');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that an error message for invalid email appears
      cy.contains('Invalid email format').should('be.visible');
    });
  
    it('should display an error for password mismatch or weakness', () => {
      // Enter weak or mismatched password
      cy.get('input[name="firstname"]').type('Eva');
      cy.get('input[name="lastname"]').type('Elfie');
      cy.get('input[name="pseudo"]').type('Eva_Elfie');
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type('Eva1.');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that an error message for weak password appears
      cy.contains('Password must contain uppercase, lowercase, a number and a special charactere #?!@$%^&*-.').should('be.visible');
    });
  
    it('should display an error when trying to sign up with an existing email', () => {
      // Try to sign up with an already existing email
      cy.get('input[name="firstname"]').type('Eva');
      cy.get('input[name="lastname"]').type('Elfie');
      cy.get('input[name="pseudo"]').type('Eva_Elfie');
      cy.get('input[name="email"]').type('Jhon.snow@example.com');
      cy.get('input[name="password"]').type('Password123.');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Verify that an error message for existing email appears
      cy.contains('An error occurred, please try again.').should('be.visible');
    });
  });
  