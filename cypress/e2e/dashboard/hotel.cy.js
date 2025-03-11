describe('E2E Tests for DashboardHotel', () => {
    const userEmail = 'Lana@example.com';
    const password = 'EvaElfie1234.';
    const fakeTokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkV2YSBFbGZpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJFdmFAZXhhbXBsZS5jb20iLCJwc2V1ZG8iOiJFdmEgRWxmaWUiLCJmaXJzdG5hbWUiOiJFdmEiLCJsYXN0bmFtZSI6IkVsZmllIn0.jZzZizI2ifzTyURJAy1Du3uF3Ly09-YX2QguC45A64g'

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
              id: "3",
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
            req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
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
  describe('Hotel', () =>{
    it('should fetch and display hotels', () => {
    
      // Ajout du token dans les headers de la requête API
        cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC', (req) => {
            req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
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

    cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
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
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
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
  
    it('should display Hotel created successfully! when add a new hotel', () => {
      cy.intercept('POST', '/hotel', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 201,
          body: { id: '3', name: 'New Hotel', location: 'New Location' },
        });
      }).as('addHotel');
  
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

    it('should display Hotel updated successfully! when update hotel', () => {
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
  
    it('should dispare hotel when delete a hotel', () => {
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
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
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

    it('should dispaly hotel not found', () =>{
      
      cy.intercept('GET', '/hotel/1', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 201,
          body: {
            "id": "1",
            "name": "Hotel 1",
            "location": "Location 1",
            "description": "superbe hotel",
            "picture_list": [],
            "price": 1
          },
        });
      }).as('fetchHotel');
      
      cy.get('a').contains('See more').first().click();

      cy.wait('@fetchHotel');

      cy.contains('Hotel not found').should('be.visible');
    });

    it('should display Booking successfully created! when booking hotel and redirect to Bookind dashboard', () =>{
      
      cy.intercept('GET', '/hotel/1', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 200,
          body: {
            "statusCode": 200,
            "message": "Hotel retrieved successfully",
            "data": {
              "id": "1",
              "name": "Hotel 1",
              "location": "Location 1",
              "description": "superbe hotel",
              "picture_list": [],
              "price": 1
            }
          },
        });
      }).as('fetchHotel');

      cy.intercept('POST', '/booking', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 200,
          body: {
            "statusCode": 200,
            "message": "Booking successfully",
            "data": {
              "id": "1",
              "checkInDate": "03/11/2025",
              "checkOutDate": "03/15/2025",
              "createdAt":"03/11/2025",
              "userId": "3",
              "hotelId": "1",
              "name": "Hotel 1",
              "price": 1
            }
          },
        });
      }).as('bookingHotel');

      cy.intercept('GET', '/booking', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
          statusCode: 200,
          body: {
            message: "Booking edit successfully",
            data: [
                {
                    id: "3",
                    checkInDate: "2025-03-11T23:00:00.000Z",
                    checkOutDate: "2025-03-15T23:00:00.000Z",
                    createdAt: "2025-03-10T23:17:58.000Z",
                    user: {
                        id: "3",
                        firstname: "Eva",
                        lastname: "Elfie",
                        email: userEmail,
                        pseudo: "Eva",
                        role: "admin"
                    },
                    hotel: {
                        id: "1",
                        name: "Chez Constant",
                        street: "26 Rue Villon, 8e arr., 69008 Lyon",
                        location: "France",
                        description: "L'Hotel Le Lumière est situé à seulement 450 mètres de la station de métro Sans-Souci permettant de rejoindre directement le centre historique de Lyon. L'établissement vous propose un hébergement 2 étoiles affichant un décor inspiré du cinéma. Les chambres ont été décorées sobrement et disposent d'une télévision à écran LCD. Chacune comporte également du matériel de repassage, une connexion Wi-Fi gratuite et une salle de bains privative avec articles de toilette gratuits.",
                        picture_list: [
                            "https://i.ibb.co/FkDZdMqz/180052554.jpg",
                            "https://i.ibb.co/zWKHn4G4/654909359.jpg",
                            "https://i.ibb.co/FLLYgFSr/28170419.jpg",
                            "https://i.ibb.co/ynnTdgzh/654909352.jpg",
                            "https://i.ibb.co/zTVfwnB5/180051921.jpg",
                            "https://i.ibb.co/Ndpdg5wM/654921574.jpg",
                            "https://i.ibb.co/whKywh1r/616413440.jpg"
                        ],
                        price: 70
                    }
                }
            ]
        },
        });
      }).as('booking');
      
      cy.get('a').contains('See more').first().click();

      cy.wait('@fetchHotel');

      cy.get('input[name="checkIn"]').type('03/11/2025');
      cy.get('input[name="checkOut"]').type('03/15/2025');

      cy.get('button').contains('Book Now').click();

      cy.wait('@bookingHotel');

      cy.contains('Booking successfully created!').should('be.visible');

      cy.wait('@booking');

      cy.url().should('include', '/dashboard/booking');

    })

    }); 
  })



  