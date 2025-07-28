import { Interception } from 'cypress/types/net-stubbing';

const expectedResponses = [
    { urlPattern: /created$/, expected: { statusCode: 201, statusMessage: 'Created' }},
    { urlPattern: /no-content$/, expected: { statusCode: 204, statusMessage: 'No Content' }},
    { urlPattern: /moved$/, expected: { statusCode: 301, statusMessage: 'Moved Permanently' }},
    { urlPattern: /bad-request$/, expected: { statusCode: 400, statusMessage: 'Bad Request' }},
    { urlPattern: /unauthorized$/, expected: { statusCode: 401, statusMessage: 'Unauthorized' }},
    { urlPattern: /forbidden$/, expected: { statusCode: 403, statusMessage: 'Forbidden' }},
    { urlPattern: /invalid-url$/, expected: { statusCode: 404, statusMessage: 'Not Found' }},
];

describe('Links', function() {

    beforeEach(() => {
        cy.visit('/links');
    })

    it('Open a new tab by clicking on the link', function() {
        cy.get('#simpleLink').then(($link: JQuery<HTMLLinkElement>) => {
            const expectedUrl = $link.prop('href');

            cy.wrap($link)
                .invoke('removeAttr', 'target')
                .click();

            cy.url().should('eq', expectedUrl);
        })
    })

    it('Open a new tab by clicking on a link with dynamic text', function() {
        cy.get('a')
            .contains(/^Home[a-zA-Z0-9]{5}$/)
            .then(($link: JQuery<HTMLLinkElement>) => {
                const expectedUrl = $link.prop('href');

                cy.wrap($link)
                    .invoke('removeAttr', 'target')
                    .click();

                cy.url().should('eq', expectedUrl);
        })
    })


    it('Check that the links making the API call, return the correct response', function() {
        cy.intercept('https://demoqa.com/*', { log: false }).as('apiCall');
        cy.get('h5:contains("Following links will send an api call")')
            .nextUntil('#linkResponse')
            .children()
            .each(($link: JQuery<HTMLLinkElement>) => {
                cy.wrap($link).click();
                cy.wait('@apiCall')
                    .then((interception: Interception) => {
                        const reqUrl = interception.request.url;

                        const res = interception.response;
                        if (!res) {
                            const req = interception.request;
                            throw new Error(`No response received for request:
                                URL: ${req.url}
                                Method: ${req.method}
                                Headers: ${JSON.stringify(req.headers)}
                            `);
                        }

                        const expectation = expectedResponses.find(item => item.urlPattern.test(reqUrl));

                        if (!expectation) throw new Error('The expected response for the request at this URL is not registered!');

                        expect(res.statusCode).to.eq(expectation.expected.statusCode);
                        expect(res.statusMessage).to.eq(expectation.expected.statusMessage);

                        cy.get("#linkResponse")
                            .should('have.text', `Link has responded with staus ${expectation.expected.statusCode} and status text ${expectation.expected.statusMessage}`);
                    });
            });
    })
})