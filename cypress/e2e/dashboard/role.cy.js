/// <reference types="cypress" />

describe('role display', () => {
    const userEmail = 'Lana@example.com';
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTkiLCJuYW1lIjoiTGFuYSBSaG9hZGVzIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoidXNlciIsImVtYWlsIjoiTGFuYUBleGFtcGxlLmNvbSIsInBzZXVkbyI6IkxhbmEgUmhvYWRlcyIsImZpcnN0bmFtZSI6IkxhbmEiLCJsYXN0bmFtZSI6IlJob2FkZXMifQ.Dkkf9mrNeF5SP1F5Cx5m1AFQW-HcmF4dFDtjX98oZsY'
    const password = 'EvaElfie1234.';
  
    const userEmailAdmin = 'Eva@example.com';
    const fakeTokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkV2YSBFbGZpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJFdmFAZXhhbXBsZS5jb20iLCJwc2V1ZG8iOiJFdmEgRWxmaWUiLCJmaXJzdG5hbWUiOiJFdmEiLCJsYXN0bmFtZSI6IkVsZmllIn0.jZzZizI2ifzTyURJAy1Du3uF3Ly09-YX2QguC45A64g';
  
    describe('User Role', () => {
    beforeEach(() => {
        cy.visit('/signin');

        cy.intercept('POST', '/auth/login', (req) => {
            // Simuler une réponse réussie (code 200) pour l'utilisateur
            req.reply({
            statusCode: 200,
            body: {
                id: '999',
                email: req.body.email,
                firstname: 'Lana',
                lastname: 'Rhoades',
                pseudo: 'Lana',
                token: fakeToken, 
            },
            });
        }).as('LoginUser');

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

        });
        it('should see user information and not see admin content', () => {
            cy.contains('User').should('not.exist');
            cy.contains('Task').should('not.exist');
            cy.contains('Analytics').should('not.exist');
            cy.contains('System & Maintenance').should('not.exist');
        });
        it('should not see button add hotel', () => {
            cy.visit('/dashboard/hotel');
            cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC')
            cy.contains('Add Hotel').should('not.exist');
        });

        it('admin should not see delete button in booking', () =>{
            cy.intercept('GET', '/booking/user/999', (req) => {
            req.headers['Authorization'] = `Bearer ${fakeToken}`;
            req.reply({
                statusCode: 200,
                message: "Ok",
                body: {
                    message: "Booking retrieved successfully",
                    data: [
                            {
                                id: "2",
                                checkInDate: "2025-03-10T23:00:00.000Z",
                                checkOutDate: "2025-03-13T23:00:00.000Z",
                                createdAt: "2025-03-10T23:17:58.000Z",
                                user: {
                                    id: "999",
                                    firstname: "Lana",
                                    lastname: "Rhoades",
                                    email: userEmail,
                                    pseudo: "Lana",
                                    role: "admin"
                                },
                                hotel: {
                                    id: "69",
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
                                    price: 1
                                }
                            }
                        ]
                    }
                });
            }).as('fetchBooking');

            cy.visit('/dashboard/booking');
            cy.wait('@fetchBooking');

            cy.get('button[name="delete"]').should('not.exist');
        });
    });

    
  
    describe('Admin Role', () => {
      beforeEach(() => {
        cy.visit('/signin');
    
        cy.intercept('POST', '/auth/login', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              id: '999',
              email: req.body.email,
              firstname: 'Eva',
              lastname: 'Elfie',
              pseudo: 'Eva',
              token: fakeTokenAdmin, 
            },
          });
        }).as('LoginAdmin');
    
        // Simuler la saisie des informations
        cy.get('input[name="email"]').type(userEmailAdmin);
        cy.get('input[name="password"]').type(password);
    
        // Soumettre le formulaire
        cy.get('button[type="submit"]').click();
    
        // Vérifier si l'API a bien été appelée avec le bon token
        cy.wait('@LoginAdmin').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          expect(interception.response.body.token).to.eq(fakeTokenAdmin);
        });
    
        // Vérifier la redirection ou l'apparition d'un message de bienvenue
        cy.url().should('include', '/dashboard');
      });
  
      it('should see admin information and admin content', () => {
        cy.contains('User').should('be.visible');
        cy.contains('Task').should('be.visible');
        cy.contains('Analytics').should('be.visible');
        cy.contains('System & Maintenance').should('be.visible');
      });

      it('admin should  see button add hotel', () => {
        cy.visit('/dashboard/hotel');
        cy.intercept('GET', '/hotel?limit=10&sortBy=name&order=ASC')
        cy.contains('Add Hotel').should('exist');

      });

      it('admin should see delete button in booking', () =>{
      cy.intercept('GET', '/booking', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
        req.reply({
            statusCode: 200,
            message: "Ok",
            body: {
                message: "Booking retrieved successfully",
                data: [
                        {
                            id: "2",
                            checkInDate: "2025-03-10T23:00:00.000Z",
                            checkOutDate: "2025-03-13T23:00:00.000Z",
                            createdAt: "2025-03-10T23:17:58.000Z",
                            user: {
                                id: "1",
                                firstname: "Eva",
                                lastname: "Elfie",
                                email: userEmail,
                                pseudo: "Lana",
                                role: "admin"
                            },
                            hotel: {
                                id: "69",
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
                                price: 1
                            }
                        }
                    ]
                }
            });
        }).as('fetchBooking');

        cy.visit('/dashboard/booking');
        cy.wait('@fetchBooking');

        cy.get('button[name="delete"]').should('exist');
      });
    });
  });
  