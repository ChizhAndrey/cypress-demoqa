
describe('Buttons', function() {

    beforeEach(() => {
        cy.visit('/buttons');
    })

    it('Double click the button', function() {
        cy.get("#doubleClickBtn").dblclick();
        cy.get("#doubleClickMessage").should("have.text", "You have done a double click");
    })

    it('Right click the button', function() {
        cy.get("#rightClickBtn").rightclick();
        cy.get("#rightClickMessage").should("have.text", "You have done a right click");
    })

    it('Click the button with the dynamic id', function() {
        cy.get("button").contains(/^Click Me$/).click();
        cy.get("#dynamicClickMessage").should("have.text", "You have done a dynamic click");
    })
})