import textBoxPage from "../pages/textBoxPage";


describe("Interacting with different elements", function() {

    it("Fill in and submit the textbox with valid data", function() {
        textBoxPage.visit();
        cy.fixture("validDataForTextBox").then(data => {
            textBoxPage.fillAndSubmitTextBox(data);
            textBoxPage.checkOutput(data);
        })
    })

    it("Submit the textbox with empty fields", function() {
        textBoxPage.visit();
        textBoxPage.submitTextBoxWithEmptyFields();
        textBoxPage.elements.outputFields().should("not.be.exist");
    })

    it("Fill in and submit the textbox with the wrong email address", function() {
        textBoxPage.visit();
        cy.fixture("dataForTextBoxWithWrongEmail").then(data => {
            textBoxPage.fillAndSubmitTextBox(data);
            textBoxPage.elements.userForm().within(() => {
                textBoxPage.elements.userEmail().should("have.css", "border", "1px solid rgb(255, 0, 0)");
            });
            textBoxPage.elements.outputFields().should("not.be.exist");
        })
    })
})