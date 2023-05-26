import { faker } from "@faker-js/faker";

export interface APIUser {
    userName: string,
    password: string,
    books: {
        isbn: string,
        title: string,
        subTitle: string,
        author: string,
        publish_date: string, 
        publisher: string,
        pages: number, 
        description: string,
        website: string
    }[] | []
}

export type ISBN = APIUser["books"][number]["isbn"];

export const loginByAPI = (userData: APIUser) => {
    cy.session(["loginByAPI", userData], () => {
        cy.request({
            method: "POST",
            url: "/account/v1/GenerateToken",
            body: {
                userName: userData.userName,
                password: userData.password,
            }
        });

        cy.request({
            method: "POST",
            url: "/account/v1/login",
            body: {
                userName: userData.userName,
                password: userData.password,
            }
        }).then((res) => {
            expect(res.status).to.equal(200);
            
            cy.setCookie("userName", userData.userName);
            cy.setCookie("userID", res.body.userId);
            cy.setCookie("token", res.body.token);
            cy.setCookie("expires", res.body.expires);
            cy.setCookie("_gat_UA-109033876-1", "1")
        })

    });
}

export const createUser = (user: APIUser) => {
    return cy.request({
        method: "POST",
        url: "/account/v1/user",
        body: user
    });
}

export const generateToken = (userData: APIUser) => {
    return cy.request({
        method: "POST",
        url: "/account/v1/GenerateToken",
        body: {
            userName: userData.userName,
            password: userData.password,
        }
    });
} 

export const checkAuthorization = (userData: APIUser) => {
    return cy.request({
        method: "POST",
        url: "/account/v1/Authorized",
        body: {
            userName: userData.userName,
            password: userData.password,
        }
    });
}

export const getUserInformation = (userID: string) => {
    return cy.getCookie("token").then(token => {
        expect(token, "Token").to.not.be.null;

        return cy.request({
            method: "GET",
            url: `/account/v1/user/${userID}`,
            headers: {
                authorization: `Bearer ${token!.value}`
            }
        });
    });
}

export const deleteUser = (userID: string) => {
    return cy.getCookie("token").then(token => {
        expect(token, "Token").to.not.be.null;

        return cy.request({
            method: "DELETE",
            url: `/account/v1/user/${userID}`,
            headers: {
                authorization: `Bearer ${token!.value}`
            }
        });
    });
}

export const createUserData = (): APIUser => {

    return {
        userName: faker.name.firstName() + faker.name.lastName() + faker.random.numeric(2),
        password: "$Qwerty_1234",
        books: []
    }
}

export const getListOfAllBooks = () => {
    return cy.request({
        method: "GET",
        url: "/BookStore/v1/Books"
    });
}

export const getBook = (ISBN: ISBN) => {
    return cy.request({
        method: "GET",
        url: "/BookStore/v1/Book",
        qs: {
            ISBN
        }
    });
}

export const addBooksToUser = (userId: string, collectionOfIsbns: {isbn: ISBN}[]) => {
    return cy.getCookie("token").then(token => {
        expect(token, "Token").to.not.be.null;

        return cy.request({
            method: "POST",
            url: "/BookStore/v1/Books",
            headers: {
                authorization: `Bearer ${token!.value}`
            },
            body: {
                userId,
                collectionOfIsbns
            }
        });
    });
}

export const deleteAllBooksFromUserCollection = (UserId: string) => {
    return cy.getCookie("token").then(token => {
        expect(token, "Token").to.not.be.null;

        return cy.request({
            method: "DELETE",
            url: "/BookStore/v1/Books",
            headers: {
                authorization: `Bearer ${token!.value}`
            },
            qs: {
                UserId
            }
        });
    });
}

export const deleteBookFromUserCollection = (isbn: ISBN, userId: string) => {
    return cy.getCookie("token").then(token => {
        expect(token, "Token").to.not.be.null;

        return cy.request({
            method: "DELETE",
            url: "/BookStore/v1/Book",
            headers: {
                authorization: `Bearer ${token!.value}`
            },
            body: {
                isbn,
                userId
              }
        });
    });
}

export const updateBookForUser = (currentIsbn: ISBN, newIsbn: ISBN, userId: string) => {
    return cy.getCookie("token").then(token => {
        expect(token, "Token").to.not.be.null;

        return cy.request({
            method: "PUT",
            url: `/BookStore/v1/Books/${currentIsbn}`,
            headers: {
                authorization: `Bearer ${token!.value}`
            },
            body: {
                userId,
                isbn: newIsbn
            }
        })
    })
}