describe('E2E Tests for DashboardHotel', () => {
    const userEmail = 'Lana@example.com';
    const password = 'EvaElfie1234.';
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTkiLCJuYW1lIjoiTGFuYSBSaG9hZGVzIiwiaWF0IjoxNTE2MjM5MDIyfQ.3f04-3zF25zDG_EhH70Z40uZRQL7ghJIzTiAnw3Q5f4'; // Simulé
  
    beforeEach(() => {
      // Simuler la connexion avec le token avant chaque test
      cy.intercept('POST', '/auth/login', (req) => {
        if (req.body.email === userEmail) {
          req.reply({
            statusCode: 200,
            body: {
              token: fakeToken,
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
      cy.intercept('POST', '/hotel/', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeToken}`;
        req.reply({
          statusCode: 201,
          body: { id: '3', name: 'New Hotel', location: 'New Location' },
        });
      }).as('addHotel');
  
      cy.visit('/dashboard/hotel');
  
      // Cliquer sur le bouton pour ajouter un hôtel
      cy.get('button').contains('Add Hotel').click();
  
      // Simuler l'ajout d'un hôtel
    //   cy.get('#Hotel Name').type('Un trou');
    //   cy.get('#r1f').type('En face de chez Constant');
      cy.get('#price').type(50);
    //   cy.get('#r1g').click();
  
      cy.wait('@addHotel');
  
      // Vérifier si le nouvel hôtel a été ajouté
      cy.contains('New Hotel').should('be.visible');
    });
  
    // it('should delete a hotel', () => {
    //   cy.intercept('DELETE', '/api/hotels/1', (req) => {
    //     req.headers['Authorization'] = `Bearer ${fakeToken}`;
    //     req.reply({
    //       statusCode: 200,
    //     });
    //   }).as('deleteHotel');
  
    //   cy.visit('/dashboard/hotel');
  
    //   // Simuler la suppression d'un hôtel
    //   cy.get('button').contains('Delete').click();
  
    //   cy.wait('@deleteHotel');
  
    //   // Vérifier que l'hôtel a bien été supprimé
    //   cy.contains('Hotel 1').should('not.exist');
    // });
  
    // it('should handle errors correctly', () => {
    //   cy.intercept('GET', '/api/hotels', (req) => {
    //     req.headers['Authorization'] = `Bearer ${fakeToken}`;
    //     req.reply({
    //       statusCode: 500,
    //       body: { error: 'Failed to fetch hotels' },
    //     });
    //   }).as('fetchHotelsError');
  
    //   cy.visit('/dashboard/hotel');
  
    //   cy.wait('@fetchHotelsError');
  
    //   // Vérifier l'affichage de l'erreur
    //   cy.contains('Failed to fetch hotels').should('be.visible');
    // });
  });
  