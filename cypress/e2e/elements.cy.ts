import textBoxPage from "../pages/textBoxPage";


describe("Interacting with different elements", function() {

    it("Fill in and submit the textbox with valid data", function() {
        textBoxPage.visit();
        cy.fixture("validDataForTextBox").then(data => {
            textBoxPage.fillAndSubmitTextBox(data);
            textBoxPage.checkOutput(data);
        })
    })

})