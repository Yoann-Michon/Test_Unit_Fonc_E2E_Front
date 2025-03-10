/// <reference types="cypress" />

describe('Connexion utilisateur', () => {
  const userEmail = 'Lana@example.com';
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTkiLCJuYW1lIjoiTGFuYSBSaG9hZGVzIiwiaWF0IjoxNTE2MjM5MDIyfQ.3f04-3zF25zDG_EhH70Z40uZRQL7ghJIzTiAnw3Q5f4'; // Ton token simulé
  beforeEach(() => {
    cy.visit('/signin');

    cy.intercept('POST', '/auth/login', (req) => {
      if (req.body.email === userEmail) {
          // Simuler une réponse réussie (code 200) pour d'autres emails
      req.reply({
        statusCode: 200,
        body: {
            id: '999',
            email: req.body.email,
            firstname: 'Lana',
            lastname: 'Rhoades',
            pseudo: 'Lana',
            token: fakeToken, // Vérifie que ce champ est bien présent
        },
    });
      } else {
          // Simuler une réponse avec un code 409 pour un email déjà existant
          req.reply({
            statusCode: 500,
            body: {
                error: 'Email already exists',
            },
        });
      }


  }).as('LoginUser')
  });

  it('should sign up with valid information and a simulated token', () => {
    // Simuler la saisie des informations
    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type('EvaElfie1234.');

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

     // Vérifier si l'API a bien été appelée avec le bon token
     cy.wait('@LoginUser').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.token).to.eq(fakeToken);
    });

    // Vérifier la redirection ou l'apparition d'un message de bienvenue
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome to your dashboard!').should('be.visible');
});

  it('should display an error with invalid credentials', () => {

    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('Wrongpassword1.');

    cy.get('button[type="submit"]').click();


    cy.contains('Error logging in. Please try again.').should('be.visible');
  });

  it('should display an email validation error', () => {

    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

 
    cy.contains('Email is required').should('be.visible');
  });

  it('should display a password validation error', () => {

    cy.get('input[name="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();


    cy.contains('Password is required').should('be.visible');
  });
});
