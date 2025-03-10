describe('Sign In Page', () => {
    beforeEach(() => {
      // Visiter la page de connexion avant chaque test
      cy.visit('/signin');
    });
  
    it('should display the sign-in form', () => {
      cy.get('form').should('exist');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('have.text', 'Sign in');
    });
  
    it('should display an error message when email is invalid', () => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.get('.MuiFormHelperText-root').should('contain', 'email must be a valid email');
    });
  
    it('should display an error message when password is empty', () => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('');
      cy.get('button[type="submit"]').click();
  
      cy.get('.MuiFormHelperText-root').should('contain', 'Password is required');
    });
  
    it('should navigate to the dashboard on successful login', () => {
      // Mock AuthService to simulate a successful login
      cy.intercept('POST', '/api/auth/signin', {
        statusCode: 200,
        body: { message: 'Login successful' },
      }).as('loginRequest');
  
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.url().should('include', '/dashboard');
    });
  
    it('should show snackbar on login error', () => {
      cy.intercept('POST', '/api/auth/signin', {
        statusCode: 400,
        body: { message: 'Error logging in' },
      }).as('loginRequest');
  
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.get('.MuiSnackbar-root').should('exist');
      cy.get('.MuiSnackbarContent-root').should('contain', 'Error logging in. Please try again.');
    });

  });
  