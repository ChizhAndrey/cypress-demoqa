import 'cypress-real-events';

describe('Slider', function() {

    beforeEach(() => {
        cy.visit('/slider');
    })

    it('Should update slider value in response to mouse click position', function() {
        const position = 88; //0 => 100
        const calculation = 10 - position * 0.2;

        cy.get('input[type="range"]').should('have.attr', 'value', 25);
        cy.get('#sliderValue').should('have.attr', 'value', 25);

        cy.get('#sliderContainer').within(() => {
            cy.get('input[type="range"]')
                .invoke('width')
                .then(width => {
                    if(width) {
                        cy.get('input[type="range"]')
                            .realClick({ position: { x: (width / 100 * position) + calculation, y: 0 }});
                    }
                })
        });

        cy.get('input[type="range"]').should('have.attr', 'value', position);
        cy.get('#sliderValue').should('have.attr', 'value', position);
    })
})