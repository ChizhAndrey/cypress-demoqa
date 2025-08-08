
describe('Autocomplete', function() {

    beforeEach(() => {
        cy.visit('/auto-complete');
    })

    it('Should allow selecting multiple colors from autocomplete suggestions', function() {
        const colors = ['Red', 'White', 'Green'];

        cy.get('#autoCompleteMultiple').within(() => {
            cy.get('#autoCompleteMultipleInput').clear();
             
            colors.forEach((color) => {
                cy.get('#autoCompleteMultipleInput').type(color.slice(0, 2));
                cy.get('.auto-complete__menu-list')
                    .should('be.visible')
                    .children()
                    .first()
                    .should('contain.text', color);
                cy.get('#autoCompleteMultipleInput').type('{enter}');
            })

            cy.get('.auto-complete__multi-value').each(($el, i) => {
                expect($el).to.have.text(colors[i!]);
            })  
        })
    })

    it('Should replace previously selected color when choosing a new one', function() {
        const colors = ['White', 'Green'];
        
        cy.get('#autoCompleteSingle').within(() => {
            cy.get('#autoCompleteSingleInput').clear();

            colors.forEach((color, i) => {

                cy.get('#autoCompleteSingleInput').type(color.slice(0, 2));
                cy.get('.auto-complete__menu-list')
                    .should('be.visible')
                    .children()
                    .first()
                    .should('contain.text', color);
                cy.get('#autoCompleteSingleInput').type('{enter}');

                cy.get('.auto-complete__single-value').should('have.text', color);
            })
        })
    })
})