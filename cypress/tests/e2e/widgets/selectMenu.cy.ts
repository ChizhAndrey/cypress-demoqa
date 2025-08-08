
describe('Select menu', function() {

    beforeEach(() => {
        cy.visit('/select-menu');
    })

    it('Should select single value from optgroup dropdown', function() {
        const firstVal = 'Group 1, option 1';
        const secondVal = 'Group 2, option 2';

        cy.get('#withOptGroup').within(() => {
            cy.root().click()
            cy.contains('[class$="-option"]', firstVal).click();

            cy.get('[class$="-singleValue"]')
                .should('have.length', 1)
                .and('have.text', firstVal);

            cy.root().click()
            cy.contains('[class$="-option"]', secondVal).click();

            cy.get('[class$="-singleValue"]')
                .should('have.length', 1)
                .and('have.text', secondVal);
        })
    })

    it('Should select single value from dropdown', function() {
        const firstVal = 'Prof.';
        const secondVal = 'Other';

        cy.get('#selectOne').within(() => {
            cy.root().click();
            cy.contains('[class$="-option"]', firstVal).click();

            cy.get('[class$="-singleValue"]')
                .should('have.length', 1)
                .and('have.text', firstVal);

            cy.root().click();
            cy.contains('[class$="-option"]', secondVal).click();

            cy.get('[class$="-singleValue"]')
                .should('have.length', 1)
                .and('have.text', secondVal);
        })
    })

    it('Should select color from old style select menu', function() {
        const selectVal = 'Yellow';

        cy.get('#oldSelectMenu').select(selectVal);

        cy.get('#oldSelectMenu')
            .find('option:selected')
            .should('have.text', selectVal);    
        })

    it('Should add multiple values to creatable multi-select', function() {
        const selectVals = ['Red', 'Green'];

        cy.contains('p', 'Multiselect drop down').next().within(() => {
            cy.get('[class$="-multiValue"]').should('not.exist');

            selectVals.forEach((val) => {
                cy.get('#react-select-4-input')
                    .focus()
                    .type(`${val}{enter}`)
                    .type('{esc}');
                    
                cy.get('[class$="-multiValue"]')
                    .last()
                    .should('have.text', val);
            })

            cy.get('[class$="-multiValue"]').should('have.length', selectVals.length);
        })
    })

    it('Should select multiple options from standard multi select', function() {
        const selectVals = ['volvo', 'opel'];

        cy.get('#cars')
            .select(selectVals)
            .invoke('val')
            .should('deep.equal', selectVals);       
    })
})