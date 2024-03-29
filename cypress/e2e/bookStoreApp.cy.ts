import * as bookStoreAPI from "../support/utilityAPIFunctions";

describe("Book store application", function() {

    describe("API", function() {
        describe("Account", function() {
            it("Create user", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);
    
                bookStoreAPI.createUser(userData).should(res => {
                    expect(res.status).to.equal(201, "Status code");
                    expect(res.body.username).to.equal(userData.userName, "Username");
                    expect(res.body.userID).to.be.a("string", "userID").that.not.be.empty;
                });
            })
    
            it("Generate token", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);
    
                bookStoreAPI.createUser(userData)
                bookStoreAPI.generateToken(userData).then(res => {
                    expect(res.status).to.equal(200, "Status code");
                    expect(res.body.result).to.equal("User authorized successfully.", "Result");
                    expect(res.body.status).to.equal("Success", "Status");
                    expect(res.body.token).to.be.a("string", "Token").that.not.be.empty;
                })
                
            })
    
            it("Check user authorization", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);
    
                bookStoreAPI.createUser(userData);
                bookStoreAPI.generateToken(userData);
                bookStoreAPI.checkAuthorization(userData).then(res => {
                    expect(res.status).to.equal(200, "Status code");
                    expect(res.body, "Body").to.be.true;
                }); 
            })
    
            it("Get user information", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);
    
                bookStoreAPI.createUser(userData).then(({body}) => {
                    bookStoreAPI.loginByAPI(userData);
                    bookStoreAPI.getUserInformation(body.userID).then(res => {
                        expect(res.status).to.equal(200, "Status code");
                        expect(res.body.username).to.equal(userData.userName, "Username");
                        expect(res.body.userId).to.equal(body.userID, "User ID");
                        expect(res.body.books).to.deep.equal(body.books, "Books");
                    });
                });
            })
    
            it("Delete user", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);
    
                bookStoreAPI.createUser(userData).then(({body}) => {
                    bookStoreAPI.loginByAPI(userData);
                    bookStoreAPI.deleteUser(body.userID).should(res => {
                        expect(res.status).to.equal(204, "Status code");
                        expect(res.body, "Body").to.be.empty;
                    });
                });          
            })
        })

        describe("BookStore", function() {
            it("Get a list of all books from a bookstore", function() {
                bookStoreAPI.getListOfAllBooks().then(res => {
                    expect(res.status).to.equal(200, "Status code");
                    expect(res.body.books).to.have.length(8, "Books");
                });
            })

            it("Get a book from a bookstore", function() {
                cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                    const book = books[4];

                    bookStoreAPI.getBook(book.isbn).then(res => {
                        expect(res.status).to.equal(200, "Status code");
                        expect(res.body).to.deep.equal(book, "Book");
                    });
                });
            })

            it("Add books to user", function() {
                const userData = bookStoreAPI.createUserData();

                cy.log("User", userData);

                cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                    const collectionOfIsbns = Cypress._.sampleSize(books, 3).map(book => { return { isbn: book.isbn } });
                    
                    bookStoreAPI.createUser(userData).then(({body}) => {
                        bookStoreAPI.loginByAPI(userData);
                        bookStoreAPI.addBooksToUser(body.userID, collectionOfIsbns).then(res => {
                            expect(res.status).to.equal(201, "Status code");
                            expect(res.body.books).to.deep.equal(collectionOfIsbns, "Books");
                        });
                    });
                });       
            })

            it("Delete all books from a user collection", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);

                cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                    const collectionOfIsbns = Cypress._.sampleSize(books, 3).map(book => { return { isbn: book.isbn } });
                    
                    bookStoreAPI.createUser(userData).then(({body}) => {
                        bookStoreAPI.loginByAPI(userData);
                        bookStoreAPI.addBooksToUser(body.userID, collectionOfIsbns).then(res => {
                            expect(res.body.books).to.deep.equal(collectionOfIsbns, "Books");
                        });
                        bookStoreAPI.deleteAllBooksFromUserCollection(body.userID).then(res => {
                            expect(res.status).to.equal(204, "Status code");
                            expect(res.body, "Body").to.be.empty;
                        });
                    });
                });
            })

            it("Delete a book from a user collection", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);

                cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                    const collectionOfIsbns = Cypress._.sampleSize(books, 3).map(book => { return { isbn: book.isbn } });
                    
                    bookStoreAPI.createUser(userData).then(({body}) => {
                        bookStoreAPI.loginByAPI(userData);
                        bookStoreAPI.addBooksToUser(body.userID, collectionOfIsbns).then(res => {
                            expect(res.body.books).to.deep.equal(collectionOfIsbns, "Books");
                        });
                        bookStoreAPI.deleteBookFromUserCollection(collectionOfIsbns[0].isbn, body.userID).then(res => {
                            expect(res.status).to.equal(204, "Status code");
                        });
                    });
                });
            })

            it("Update a book in a user collection", function() {
                const userData = bookStoreAPI.createUserData();
    
                cy.log("User", userData);

                cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                    const collectionOfIsbns = books.map(book => { return { isbn: book.isbn } });
                    const currentIsbn = collectionOfIsbns[0];
                    const newIsbn = collectionOfIsbns[1];
                    
                    bookStoreAPI.createUser(userData).then(({body}) => {
                        bookStoreAPI.loginByAPI(userData);
                        bookStoreAPI.addBooksToUser(body.userID, [currentIsbn]).then(res => {
                            expect(res.body.books).to.deep.equal([currentIsbn], "Books");
                        });
                        bookStoreAPI.updateBookForUser(currentIsbn.isbn, newIsbn.isbn, body.userID).then(res => {
                            expect(res.status).to.equal(200, "Status code");
                            expect(res.body.username).to.equal(body.username, "Username")
                            expect(res.body.userId).to.equal(body.userID, "User ID");
                            expect(res.body.books).to.deep.equal([books[1]], "Books");
                        });
                    });
                });
            })
        })
    })

    describe("E2E", function() {
        it("Login in Book Store App", function() {
            cy.fixture<{userName: string, password: string}>("userDataForAPI").then(({userName, password}) => {
                cy.visit("/login");
            
                cy.get("[placeholder='UserName']")
                    .clear()
                    .type(userName);
                    
                cy.get("[placeholder='Password']")
                    .clear()
                    .type(password);
            
                cy.get("button:contains('Login')").click();
            
                cy.url().should("equal", Cypress.config().baseUrl + "profile");
                cy.get("#userName-value").should("have.text", userName);
            });
        })
    
        it("Add book to user collection", function() {
            const userData = bookStoreAPI.createUserData();
        
            cy.log("User", userData);
        
            bookStoreAPI.createUser(userData);
            bookStoreAPI.loginByAPI(userData);
    
            cy.visit("/books")
    
            cy.get("span:contains('Git Pocket Guide')").click();
            cy.url().should("equal", Cypress.config().baseUrl + "books?book=9781449325862"); 
            cy.get("#ISBN-wrapper").should("contain.text", "9781449325862");
    
            cy.window().then(win => {
                cy.stub(win, "alert").as("alert");
            });
    
            cy.get("button:contains('Add To Your Collection')").click();
            cy.get("@alert")
                .its("firstCall.args.0")
                .should("be.equal", "Book added to your collection.");
                
            cy.visit("/profile");
    
            cy.get(".rt-tbody div[role='row']:contains('Git Pocket Guide')").should("be.visible");
        })
    
        it("Delete a book from a user collection", function() {
            const userData = bookStoreAPI.createUserData();
        
            cy.log("User", userData);
        
            cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                const isbn = books.map(book => { return { isbn: book.isbn } })[0];
                
                bookStoreAPI.createUser(userData).then(({body}) => {
                    bookStoreAPI.loginByAPI(userData);
                    bookStoreAPI.addBooksToUser(body.userID, [isbn]);
                });
    
                cy.visit("/profile").then(win => {
                    cy.stub(win, "alert").as("alert");
                });
    
                cy.get(".rt-tbody div[role='row']:contains('Git Pocket Guide')").within(() => {
                    cy.get("span[title='Delete']").click();
                });
    
                cy.get(".modal-dialog[role='document']").within(() => {
                    cy.get(".modal-body").should("have.text", "Do you want to delete this book?");
                    cy.get("button:contains('OK')").click();
                });
    
                cy.get("@alert")
                    .its("firstCall.args.0")
                    .should("be.equal", "Book deleted.");
    
                cy.get(".rt-tbody div[role='row']:contains('Git Pocket Guide')").should("not.exist");
            });
        })
    
        it("Delete all books from a user collection", function() {
            const userData = bookStoreAPI.createUserData();
        
            cy.log("User", userData);
    
            cy.fixture<{books: bookStoreAPI.APIUser["books"]}>("books").then(({books}) => {
                const collectionOfIsbns = Cypress._.sampleSize(books, 5).map(book => { return { isbn: book.isbn } });
                
                bookStoreAPI.createUser(userData).then(({body}) => {
                    bookStoreAPI.loginByAPI(userData);
                    bookStoreAPI.addBooksToUser(body.userID, collectionOfIsbns);
                });
    
                cy.visit("/profile").then(win => {
                    cy.stub(win, "alert").as("alert");
                });
    
                cy.get(".rt-tbody div[role='row']")
                    .not(".-padRow")
                    .should("have.length", 5);
    
                cy.get(".buttonWrap button:contains('Delete All Books')").click();
    
                cy.get(".modal-dialog[role='document']").within(() => {
                    cy.get(".modal-body").should("have.text", "Do you want to delete all books?");
                    cy.get("button:contains('OK')").click();
                });
    
                cy.get("@alert")
                    .its("firstCall.args.0")
                    .should("be.equal", "All Books deleted.");
    
                cy.get(".rt-tbody div[role='row']")
                    .not(".-padRow")
                    .should("not.exist");
            });
        })
    
        it("Delete user account", function() {
            const userData = bookStoreAPI.createUserData();
        
            cy.log("User", userData);
    
            bookStoreAPI.createUser(userData);
            bookStoreAPI.loginByAPI(userData);
    
            cy.visit("/profile").then(win => {
                cy.stub(win, "alert").as("alert");
            });
    
            cy.get(".buttonWrap button:contains('Delete Account')").click();
    
            cy.get(".modal-dialog[role='document']").within(() => {
                cy.get(".modal-body").should("have.text", "Do you want to delete your account?");
                cy.get("button:contains('OK')").click();
            });
    
            cy.get("@alert")
                .its("firstCall.args.0")
                .should("be.equal", "User Deleted.");
    
            cy.url().should("equal", Cypress.config().baseUrl + "login");
            cy.get("#userForm").should("be.visible");
        })
    })
})