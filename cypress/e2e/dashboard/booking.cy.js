describe("Bookings Page", () => {
    const userEmail = 'Eva@example.com';
    const password = 'EvaElfie1234.';
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTkiLCJuYW1lIjoiTGFuYSBSaG9hZGVzIiwiaWF0IjoxNTE2MjM5MDIyfQ.3f04-3zF25zDG_EhH70Z40uZRQL7ghJIzTiAnw3Q5f4'; // Simulé
    const fakeTokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkV2YSBFbGZpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJFdmFAZXhhbXBsZS5jb20iLCJwc2V1ZG8iOiJFdmEgRWxmaWUiLCJmaXJzdG5hbWUiOiJFdmEiLCJsYXN0bmFtZSI6IkVsZmllIn0.jZzZizI2ifzTyURJAy1Du3uF3Ly09-YX2QguC45A64geyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkV2YSBFbGZpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJFdmFAZXhhbXBsZS5jb20iLCJwc2V1ZG8iOiJFdmEgRWxmaWUiLCJmaXJzdG5hbWUiOiJFdmEiLCJsYXN0bmFtZSI6IkVsZmllIn0.jZzZizI2ifzTyURJAy1Du3uF3Ly09-YX2QguC45A64g';

  beforeEach(() => {
      // Simuler la connexion avec le token avant chaque test
      cy.intercept('POST', '/auth/login', (req) => {
          req.reply({
            statusCode: 200,
            body: {
              token: fakeTokenAdmin,
              email: req.body.email,
              firstname: 'Eva',
              lastname: 'Elfie',
              id: "1",
            },
          });
      }).as('loginRequest');
  
      cy.visit('/signin');
  
      // Simuler la soumission du formulaire avec un email et un mot de passe
      cy.get('input[name="email"]').type(userEmail);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      // Attendre la réponse de l'API pour valider la connexion
      cy.wait('@loginRequest');
      cy.visit('/dashboard/booking');
      // Ajout du token dans les headers de la requête API
      cy.intercept('GET', '/booking', (req) => {
        req.headers['Authorization'] = `Bearer ${fakeToken}`;
        req.reply({
            statusCode: 200,
            message: "Ok",
            body: {
                message: "Booking retrieved successfully",
                data: [
                    {
                        id: "3",
                        checkInDate: "2025-03-10T23:00:00.000Z",
                        checkOutDate: "2025-03-13T23:00:00.000Z",
                        createdAt: "2025-03-10T23:17:58.000Z",
                        user: {
                            id: "3",
                            firstname: "Lana",
                            lastname: "Rhoades",
                            email: userEmail,
                            pseudo: "Lana",
                            role: "admin"
                        },
                        hotel: {
                            id: "2726fd0a-d20f-456a-b25d-ad4436264557",
                            name: "Hotel Le Lumière",
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
                    },
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
  
        cy.wait('@fetchBooking');
    });
    describe("Booking admin", () =>{

        it("should display at least one booking in the table", () => {
            cy.get("table").should("be.visible");
            cy.get("table tbody tr").should("have.length.greaterThan", 0); // Vérifie qu'il y a au moins une ligne dans le tableau
        });    

        it("should display Booking updated successfully when edit a booking", () => {
            cy.intercept('PATCH', '/booking/3', (req) => {
                req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
                req.reply({
                    statusCode: 201,
                    message: "Ok",
                    body: {
                        message: "Booking edit successfully",
                        data: [
                            {
                                id: "3",
                                checkInDate: "2025-03-10T23:00:00.000Z",
                                checkOutDate: "2025-03-13T23:00:00.000Z",
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
                                    id: "2726fd0a-d20f-456a-b25d-ad4436264557",
                                    name: "Hotel Le Lumière",
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
                    }
                });
            }).as('editBooking');

            cy.get('button[name="edit"]').first().click();
            cy.get('input[type="date"]').first().clear().type("2025-04-01");
            cy.get('input[type="date"]').last().clear().type("2025-04-05");
            cy.contains("Save").click();
            
            cy.wait('@editBooking');
            
            cy.get(".MuiAlert-root").should("contain", "Booking updated successfully");
        });

        it("should display Booking deleted successfully when delete a booking", () => {

            cy.intercept('DELETE', '/booking/3', (req) => {
                req.headers['Authorization'] = `Bearer ${fakeTokenAdmin}`;
                req.reply({
                    statusCode: 200,
                    body: { id: '3'},
                });
            }).as('editBooking');

            cy.get('button[name="delete"]').first().click();
            cy.contains("Confirm Deletion").should("be.visible");
            cy.contains("Delete").click();
            cy.get(".MuiAlert-root").should("contain", "Booking deleted successfully");
        });
    })
});