import 'cypress-real-events';

describe('Menu', function() {

    beforeEach(() => {
        cy.visit('/menu');
    })

    it('Should open nested submenu and apply hover styles on navigation', function() {
        const baseColor = 'rgb(36, 175, 21)';
        const hoverColor = 'rgb(0, 63, 32)';

        cy.get('#nav').within(() => {
            cy.get('li:contains("Main Item 2")')
                .should('have.css', 'background-color', baseColor)
                .realHover()
                .should('have.css', 'background-color', hoverColor)

                .find('li:contains("SUB SUB LIST")')
                .should('have.css', 'background-color', baseColor)
                .realHover()
                .should('have.css', 'background-color', hoverColor)

                .find('li:contains("Sub Sub Item 2")')
                .should('have.css', 'background-color', baseColor)
                .realHover()
                .should('have.css', 'background-color', hoverColor);
        })
    })
})