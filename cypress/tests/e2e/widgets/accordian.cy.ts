
describe('Accordian', function() {

    beforeEach(() => {
        cy.visit('/accordian');
    })

    it('Should have section 1 open by default with correct content', function() {
        cy.get('#section1Content')
            .should('be.visible')
            .and('include.text', 'Lorem Ipsum is simply dummy text');

        cy.get('#section2Content').should('not.be.visible');
        cy.get('#section3Content').should('not.be.visible');
    });

    it('Should allow only one section to be open at a time', function() {
        cy.get('#section3Heading').click();
        cy.get('#section3Content')
            .should('be.visible')
            .and('include.text', 'It is a long established fact');

        cy.get('#section1Content').should('not.be.visible');
        cy.get('#section2Content').should('not.be.visible');

        cy.get('#section2Heading').click();
        cy.get('#section2Content')
            .should('be.visible')
            .and('include.text', 'Contrary to popular belief');

        cy.get('#section1Content').should('not.be.visible');
        cy.get('#section3Content').should('not.be.visible');
    });
})