import textBoxPage from "../pages/textBoxPage";
import checkBoxPage from "../pages/CheckBoxPage";

describe("Interacting with different elements", function() {

    describe("Textbox", function() {
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

    describe("Checkbox", function() {
        it.only("Expand all list items", function() {
            checkBoxPage.visit();
            checkBoxPage.expandAllListItems();
            checkBoxPage.checkParentListNodesExpanded();
        })
    
        it("Collapse all list items", function() {
            checkBoxPage.visit();
            checkBoxPage.expandAllListItems();
            checkBoxPage.collapseAllListItems();
            checkBoxPage.elements.setOfListItemsOfCheckboxTree()
                .should("have.length", 1)
                .and("contain.class", "rct-node-collapsed")
        })

        it("Check the boxes for angular and react", function() {
            checkBoxPage.visit();
            checkBoxPage.expandAllListItems();
    
            checkBoxPage.checkReactCheckBox();
            checkBoxPage.elements.reactCheckBoxInput().should("be.checked");
    
            checkBoxPage.checkAngularCheckBox();
            checkBoxPage.elements.angularCheckBoxInput().should("be.checked");
    
            checkBoxPage.elements.result()
                .should("have.length", 2)
                .and("include.text", "react")
                .and("include.text", "angular");
        })
    })
})