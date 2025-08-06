
describe('Frames', function() {

    beforeEach(() => {
        cy.visit('/frames');
    })

    it('Should display correct heading inside frame1 and frame2', function() {
        cy.getIframeBody("#frame1")
            .find("h1[id='sampleHeading']")
            .should("have.text", "This is a sample page");

        cy.getIframeBody("#frame2")
            .find("h1[id='sampleHeading']")
            .should("have.text", "This is a sample page");
    })
})