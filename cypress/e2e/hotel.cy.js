describe('E2E Tests for DashboardHotel', () => {
    const userEmail = 'Lana@example.com';
    const password = 'EvaElfie1234.';
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTkiLCJuYW1lIjoiTGFuYSBSaG9hZGVzIiwiaWF0IjoxNTE2MjM5MDIyfQ.3f04-3zF25zDG_EhH70Z40uZRQL7ghJIzTiAnw3Q5f4'; // Simulé
    const fakeTokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkV2YSBFbGZpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6ImFkbWluIn0.t9Ep8pvkgIoTsQ-SpUNrVkRa0Y-_jn6s6l6Fe0lJRdQ'

    beforeEach(() => {
      // Simuler la connexion avec le token avant chaque test
      cy.intercept('POST', '/auth/login', (req) => {
        if (req.body.email === userEmail) {
          req.reply({
            statusCode: 200,
            body: {
              token: fakeTokenAdmin,
              email: req.body.email,
              firstname: 'Lana',
              lastname: 'Rhoades',
            },
          });
        }
      }).as('loginRequest');
  
      cy.visit('/signin');
  
      // Simuler la soumission du formulaire avec un email et un mot de passe
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      // Attendre la réponse de l'API pour valider la connexion
      cy.wait('@loginRequest');
      cy.visit('/dashboard/hotel');
      // Ajout du token dans les headers de la requête API
        cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC', (req) => {
            req.headers['Authorization'] = `Bearer ${fakeToken}`;
            req.reply({
            statusCode: 200,
            message: "Hotels retrieved successfully",
            body: {
                "statusCode": 200,
                "message": "Hotels retrieved successfully",
                "data": [
                  {
                    "id": "1",
                    "name": "Hotel 1",
                    "location": "Location 1",
                    "description": "superbe hotel",
                    "picture_list": [],
                    "price": 1
                  },
                  {
                    "id": "2",
                    "name": "Hotel 2",
                    "location": "Location 2",
                    "description": "superbe hotel",
                    "picture_list": [],
                    "price": 1
                  }
                ]
              }
            });
        }).as('fetchHotels');
  
        cy.wait('@fetchHotels');
    });
  
    it('should fetch and display hotels', () => {
    
        cy.visit('/dashboard/hotel');
      // Ajout du token dans les headers de la requête API
        cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC', (req) => {
            req.headers['Authorization'] = `Bearer ${fakeToken}`;
            req.reply({
            statusCode: 200,
            message: "Hotels retrieved successfully",
            body: {
                "statusCode": 200,
                "message": "Hotels retrieved successfully",
                "data": [
                  {
                    "id": "1",
                    "name": "Hotel 1",
                    "location": "Location 1",
                    "description": "superbe hotel",
                    "picture_list": [],
                    "price": 1
                  },
                  {
                    "id": "2",
                    "name": "Hotel 2",
                    "location": "Location 2",
                    "description": "superbe hotel",
                    "picture_list": [],
                    "price": 1
                  }
                ]
              }
            });
        }).as('fetchHotels');
  
        cy.wait('@fetchHotels');
  
      // Vérifier que les hôtels sont affichés
      cy.contains('Hotel 1').should('be.visible');
      cy.contains('Hotel 2').should('be.visible');
    });
  
    it('should search hotels', () => {
      cy.visit('/dashboard/hotel');

      cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeToken}`;
        req.reply({
        statusCode: 200,
        message: "Hotels retrieved successfully",
        body: {
            "statusCode": 200,
            "message": "Hotels retrieved successfully",
            "data": [
              {
                "id": "1",
                "name": "Hotel 1",
                "location": "Location 1",
                "description": "superbe hotel",
                "picture_list": [],
                "price": 1
              },
              {
                "id": "2",
                "name": "La maison de constant",
                "location": "Location 2",
                "description": "superbe hotel",
                "picture_list": [],
                "price": 1
              }
            ]
          }
        });
    }).as('fetchHotels');
    
    cy.intercept('GET', 'hotel/search/La%20maison%20de%20constant', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeToken}`;
        req.reply({
        statusCode: 200,
        message: "Hotels retrieved successfully",
        body: {
            "statusCode": 200,
            "message": "Hotels retrieved successfully",
            "data": [            
              {
                "id": "2",
                "name": "La maison de constant",
                "location": "Location 2",
                "description": "superbe hotel",
                "picture_list": [],
                "price": 1
              }
            ]
          }
        });
    }).as('searchhotels');

    cy.wait('@fetchHotels');
  
      // Simuler la recherche
      cy.get('#search').type('La maison de constant');

      cy.wait('@searchhotels');
      // Vérifier si l'hôtel filtré s'affiche
      cy.contains('La maison de constant').should('be.visible');
    });
  
    it('should add a new hotel', () => {
      cy.intercept('POST', '/hotel', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 201,
          body: { id: '3', name: 'New Hotel', location: 'New Location' },
        });
      }).as('addHotel');
  
      cy.visit('/dashboard/hotel');
  
      // Cliquer sur le bouton pour ajouter un hôtel
      cy.get('button').contains('Add Hotel').click();
  
      // Simuler l'ajout d'un hôtel
      cy.get('input[name="HotelName"]').type('Un trou');
      cy.get('input[name="Street"]').type('Rue de Constant');
      cy.get('input[name="Location"]').type('France');
      cy.get('input[name="Price"]').type(50);
      cy.get('textarea[name="Description"]').type('En face de chez Constant');
      
      cy.get('button').contains('Create').click();
  
      cy.wait('@addHotel');
  
      // Vérifier si le nouvel hôtel a été ajouté
      cy.contains('Hotel created successfully!').should('be.visible');
    });

    it('should update hotel', () => {
      cy.intercept('PATCH', '/hotel/1', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 200,
          body: { id: '1', name: 'Un trou',Street:'Rue de Constant', location: 'France', price: 50, description: 'En face de chez Constant' }
        });
      }).as('addHotel');
  
      cy.visit('/dashboard/hotel');
  
      // Cliquer sur le bouton pour ajouter un hôtel
  
      cy.get('button[name="edit"]').first().click();
      // Simuler l'edit d'un hotel
      cy.get('input[name="HotelName"]').type('Un trou');
      cy.get('input[name="Street"]').type('Rue de Constant');
      cy.get('input[name="Location"]').type('France');
      cy.get('input[name="Price"]').type(50);
      cy.get('textarea[name="Description"]').type('En face de chez Constant');
      
      cy.get('button').contains('Save Changes').click();
      
      cy.wait('@addHotel');
  
      // Vérifier si le nouvel hôtel a été ajouté
      cy.contains('Hotel updated successfully!').should('be.visible');
    });
  
    it('should delete a hotel', () => {
      cy.intercept('DELETE', '/hotel/1', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 200,
          body: { id: '1'}
        });
      }).as('deleteHotel');
  
      cy.visit('/dashboard/hotel');
  
      // Simuler la suppression d'un hôtel
      cy.get('button[name="delete"]').first().click();
  
      cy.wait('@deleteHotel');
  
      // Vérifier que l'hôtel a bien été supprimé
      cy.contains('Hotel 1').should('not.exist');
    });
  
    it('should handle errors correctly', () => {
      cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeToken}`;
        req.reply({
          statusCode: 500,
          body: { error: 'Failed to fetch hotels' },
        });
      }).as('fetchHotelsError');
  
      cy.visit('/dashboard/hotel');
  
      cy.wait('@fetchHotelsError');
  
      // Vérifier l'affichage de l'erreur
      cy.contains('Error fetching hotels: Internal Server Error').should('be.visible');
    });
  });
  