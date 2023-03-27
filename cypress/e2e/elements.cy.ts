import textBoxPage from "../pages/textBoxPage";
import checkBoxPage from "../pages/CheckBoxPage";
import webTablePage from "../pages/WebTablePage";
const { _ } = Cypress;  //(Lodash)

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
        it("Expand all list items", function() {
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

    describe("Radio button", function() {
        it("Check that text success matches the text of the selected radio button", function() {
            cy.visit("/radio-button");

            cy.get("label[for='yesRadio']").click();
            cy.get(".text-success").should("have.text", "Yes");

            cy.get("label[for='impressiveRadio']").click();
            cy.get(".text-success").should("have.text", "Impressive");
        })
    })

    describe("Web table", function() {
        it("Add user to web table by registration form", function() {
            webTablePage.visit();
            cy.fixture("dataForWebTableRegForm").then(data => {
                webTablePage.elements.addNewRecordButton().click();
                webTablePage.fillAndSubmitRegForm(data);
                webTablePage.elements.tableRows().then($rows => {
                    webTablePage.createArrayObjectsFromTableRows($rows).should("deep.include", data);
                })
            })
        })

        it("Delete user from web table", function() {
            const userEmail = "alden@example.com";
            webTablePage.visit();
            webTablePage.deleteRowFromTable(userEmail)
            webTablePage.elements.tableRows().should("not.contain", userEmail);
        })

        it("Update user in web table", function() {
            const userEmail = "alden@example.com";
            webTablePage.visit();
            cy.fixture("dataForWebTableRegForm").then(data => {
                webTablePage.updateRowInTable(userEmail);
                webTablePage.fillAndSubmitRegForm(data);
                webTablePage.elements.tableRows().then($rows => {
                    webTablePage.createArrayObjectsFromTableRows($rows).should("deep.include", data);
                })
                webTablePage.elements.tableRows().should("not.contain", userEmail);
            })
        })

        it("Filter table rows by search word", function() {
            const searchWord = "erra";
            webTablePage.visit();
            webTablePage.filterTableRowsBySearchWord(searchWord);
            webTablePage.checkTableRowsContainSearchWord(searchWord);
        })

        it("Sort table in ascending order by first name", function() {
            webTablePage.visit();
            webTablePage.sortTableByFirstName("asc");
            webTablePage.checkColumnIsSortedInOrder("firstName", "asc");
        })
    
        it("Sort table in descending order by first name", function() {
            webTablePage.visit();
            webTablePage.sortTableByFirstName("desc");
            webTablePage.checkColumnIsSortedInOrder("firstName", "desc");
        })

        it("Check the scaling of the number of rows in the table", function() {
            webTablePage.visit();
            webTablePage.checkScalingOfNumberOfRowsInTable();
        })

        it("Check table page navigation", function() {
            webTablePage.visit();
            webTablePage.elements.pageSizeSelect().select("5 rows").should("have.value", 5);
            webTablePage.elements.pageChangeInput().should("have.value", 1);
            webTablePage.elements.buttonPreviousPage().should("be.disabled");
            webTablePage.elements.buttonNextPage().should("be.disabled");
    
            webTablePage.fillTableWithGeneratedData(5);

            webTablePage.goToNextTablePage();
            webTablePage.elements.pageChangeInput().should("have.value", 2);

            webTablePage.goToPreviousTablePage();
            webTablePage.elements.pageChangeInput().should("have.value", 1);

            webTablePage.changePageByInput(2);
            webTablePage.elements.pageChangeInput().should("have.value", 2);
        })
    })

    describe("Buttons", function() {
        it("Interaction with the button by double-clicking", function() {
            cy.visit("/buttons");
            cy.get("#doubleClickBtn").dblclick();
            cy.get("#doubleClickMessage").should("have.text", "You have done a double click");
        })

        it("Interaction with the button using the right click", function() {
            cy.visit("/buttons");
            cy.get("#rightClickBtn").rightclick();
            cy.get("#rightClickMessage").should("have.text", "You have done a right click");
        })

        it("Interaction with the button with dynamic id using the click", function() {
            cy.visit("/buttons");
            cy.get("button").contains(/^Click Me/).click();
            cy.get("#dynamicClickMessage").should("have.text", "You have done a dynamic click");
        })
    })

})