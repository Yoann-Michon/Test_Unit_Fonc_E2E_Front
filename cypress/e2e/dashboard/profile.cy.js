describe('E2E Tests for DashboardProfil', () => {
    const userEmail = 'eva@example.com';
    const password = 'EvaElfie1234.';
    const fakeTokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkV2YSBFbGZpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJFdmFAZXhhbXBsZS5jb20iLCJwc2V1ZG8iOiJFdmEgRWxmaWUiLCJmaXJzdG5hbWUiOiJFdmEiLCJsYXN0bmFtZSI6IkVsZmllIn0.jZzZizI2ifzTyURJAy1Du3uF3Ly09-YX2QguC45A64g'

  beforeEach(() => {
      // Simuler la connexion avec le token avant chaque test
      cy.intercept('POST', '/auth/login', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              token: fakeTokenAdmin,
              email: userEmail,
              firstname: 'Eva',
              lastname: 'Elfie',
              id: "1",
            },
          });
      }).as('loginRequest');
  
      cy.visit('/signin');
      cy.wait(1000);
  
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.visit('/dashboard/profile');
    });

    describe('profile edit', () =>{

        it('should display Profile successfully updated! when updated profil ', () => {
            cy.intercept('PATCH', '/user/1', (req) => {
                req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
                req.reply({
                statusCode: 200,
                body: {
                  token: fakeTokenAdmin,
                  email: userEmail,
                  firstname: 'Eva',
                  lastname: 'Elfie',
                  pseudo:'Eva Elfie',
                  id: "1",
                },
                });
            }).as('editProfile');

            cy.get('button').contains('Edit').click();

            cy.get('input[name="firstname"]').clear().type("Elfie");
            cy.get('input[name="lastname"]').clear().type('Eva');
            cy.get('input[name="pseudo"]').clear().type("EvaElfie69");
            cy.get('input[name="email"]').clear().type("Eva@example.fr");

            cy.get('button').contains('Save').click();

            cy.wait('@editProfile');

            cy.contains('Profile successfully updated!').should('be.visible');

        });

        it('should display an error if the field is empty or invalid and disappear when its ok ', () =>  {
          cy.get('button').contains('Edit').click();

          //vide
            cy.get('input[name="firstname"]').clear();
            cy.get('input[name="lastname"]').clear();
            cy.get('input[name="pseudo"]').clear();
            cy.get('input[name="email"]').clear();

            cy.contains('First name is required').should('be.visible');
            cy.contains('Last name is required').should('be.visible');
            cy.contains('Username name is required').should('be.visible');
            cy.contains('Email is required').should('be.visible');

            //email invalide
            cy.get('input[name="email"]').clear().type("Eva@example");
            cy.contains('Invalid email format').should('be.visible');

            cy.get('input[name="email"]').clear().type("Evaexample");
            cy.contains('Invalid email format').should('be.visible');

            cy.get('input[name="email"]').clear().type("Evaexample.fr");
            cy.contains('Invalid email format').should('be.visible');

            //error dispeare 
            cy.get('input[name="firstname"]').clear().type("Elfie");
            cy.get('input[name="lastname"]').clear().type('Eva');
            cy.get('input[name="pseudo"]').clear().type("EvaElfie69");
            cy.get('input[name="email"]').clear().type("Eva@example.fr");

            cy.contains('First name is required').should('not.exist');
            cy.contains('Last name is required').should('not.exist');
            cy.contains('Username name is required').should('not.exist');
            cy.contains('Email is required').should('not.exist');

            //password error
            cy.get('input[name="password"]').clear().type("eva");
            cy.contains('Password must be at least 8 characters').should('be.visible');

            cy.get('input[name="password"]').clear().type("EvaElfie");
            cy.contains('Password must contain uppercase, lowercase, a number and a special charactere #?!@$%^&*-.').should('be.visible');


            cy.get('input[name="password"]').clear().type("EvaElfie69");
            cy.contains('Password must contain uppercase, lowercase, a number and a special charactere #?!@$%^&*-.').should('be.visible');

            //No password Error
            cy.get('input[name="password"]').clear().type("EvaElfie69!");
            cy.contains('Password must contain uppercase, lowercase, a number and a special charactere #?!@$%^&*-.').should('not.exist');
            cy.contains('Password must be at least 8 characters').should('not.exist');
        })

      })

});