import { textBoxPage, TextBoxUserData } from "../pages/TextBoxPage";
import checkBoxPage from "../pages/CheckBoxPage";
import { webTablePage, WebTableEmployeeData } from "../pages/WebTablePage";
import { checkHTTPResponseStatusCode, deleteDownloadsFolder, readFileFromDownloads } from "../support/utilityFunctions";
const { _ } = Cypress;  //(Lodash)

describe("Interacting with different elements", function() {

    describe("Textbox", function() {
        it("Fill in and submit the textbox with valid data", function() {
            textBoxPage.visit();
            cy.fixture<TextBoxUserData>("validDataForTextBox").then(data => {
                textBoxPage.fillAndSubmitTextBox(data);
                textBoxPage.elements.outoutContainer()
                    .should("not.have.class", "undefined")
                    .and("have.class", "border");
                textBoxPage.checkOutput(data);
            })
        })
    
        it("Submit the textbox with empty fields", function() {
            textBoxPage.visit();
            textBoxPage.submitTextBoxWithEmptyFields();
            textBoxPage.elements.outoutContainer()
                .should("not.have.class", "undefined")
                .and("not.have.class", "border");
            textBoxPage.elements.outputFields().should("not.be.exist");
        })
    
        it("Fill in and submit the textbox with the wrong email address", function() {
            textBoxPage.visit();
            cy.fixture<TextBoxUserData>("dataForTextBoxWithWrongEmail").then(data => {
                textBoxPage.fillAndSubmitTextBox(data);
                textBoxPage.elements.userForm().within(() => {
                    textBoxPage.elements.userEmail().should("have.css", "border", "1px solid rgb(255, 0, 0)");
                });
                textBoxPage.elements.outoutContainer()
                    .should("have.class", "undefined")
                    .and("not.have.class", "border");
                textBoxPage.elements.outputFields().should("not.be.exist");
            })
        })
    })

    describe("Checkbox", function() {
        it("Expand all checkboxes", function() {
            checkBoxPage.visit();
            checkBoxPage.expandAllListItems();
            checkBoxPage.checkParentListNodesExpanded();
        })
    
        it("Collapse all checkboxes", function() {
            checkBoxPage.visit();
            checkBoxPage.expandAllListItems();
            checkBoxPage.collapseAllListItems();
            checkBoxPage.elements.setOfListItemsOfCheckboxTree()
                .should("have.length", 1)
                .and("contain.class", "rct-node-collapsed")
        })

        it("Check the checkboxes in the list", function() {
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
        it("Select radio button", function() {
            cy.visit("/radio-button");

            cy.get("label[for='yesRadio']").click();
            cy.get(".text-success").should("have.text", "Yes");

            cy.get("label[for='impressiveRadio']").click();
            cy.get(".text-success").should("have.text", "Impressive");
        })
    })

    describe("Web table", function() {
        it("Add employee to the web table using the registration form", function() {
            webTablePage.visit();
            cy.fixture<WebTableEmployeeData>("dataForWebTableRegForm").then(data => {
                webTablePage.elements.addNewRecordButton().click();
                webTablePage.fillAndSubmitRegForm(data);
                webTablePage.elements.tableRows().then($rows => {
                    webTablePage.createArrayObjectsFromTableRows($rows).should("deep.include", data);
                })
            })
        })

        it("Remove employee from web table", function() {
            const userEmail = "alden@example.com";
            webTablePage.visit();
            webTablePage.deleteRowFromTable(userEmail)
            webTablePage.elements.tableRows().should("not.contain", userEmail);
        })

        it("Update employee data in web table", function() {
            const userEmail = "alden@example.com";
            webTablePage.visit();
            cy.fixture<WebTableEmployeeData>("dataForWebTableRegForm").then(data => {
                webTablePage.updateRowInTable(userEmail);
                webTablePage.fillAndSubmitRegForm(data);
                webTablePage.elements.tableRows().then($rows => {
                    webTablePage.createArrayObjectsFromTableRows($rows).should("deep.include", data);
                })
                webTablePage.elements.tableRows().should("not.contain", userEmail);
            })
        })

        it("Filter web table by keyword", function() {
            const keyword = "erra";
            webTablePage.visit();
            webTablePage.filterTableRowsBySearchWord(keyword);
            webTablePage.checkTableRowsContainSearchWord(keyword);
        })

        it("Sort web table in ascending order by the «First Name» column", function() {
            webTablePage.visit();
            webTablePage.sortTableByFirstName("asc");
            webTablePage.checkColumnIsSortedInOrder("firstName", "asc");
        })
    
        it("Sort web table in descending order by the «First Name» column", function() {
            webTablePage.visit();
            webTablePage.sortTableByFirstName("desc");
            webTablePage.checkColumnIsSortedInOrder("firstName", "desc");
        })

        it("Scaling the number of rows in a web table", function() {
            webTablePage.visit();
            webTablePage.checkScalingOfNumberOfRowsInTable();
        })

        it("Navigation of pages in the web table", function() {
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
        it("Check mouse event handling on buttons", function() {
            cy.visit("/buttons");

            cy.get("#doubleClickBtn").dblclick();
            cy.get("#doubleClickMessage").should("have.text", "You have done a double click");

            cy.get("#rightClickBtn").rightclick();
            cy.get("#rightClickMessage").should("have.text", "You have done a right click");

            cy.get("button").contains(/^Click Me/).click();
            cy.get("#dynamicClickMessage").should("have.text", "You have done a dynamic click");
        })
    })

    describe("Links", function() {
        it("Open a new tab by clicking on the link", function() {
            cy.visit("/links");

            cy.get("#simpleLink").then($link => {
                cy.wrap($link)
                    .invoke("removeAttr", "target")
                    .click();
    
                cy.url().should("eq", `${$link.attr("href")}/`);
            })
        })

        it("Open a new tab by clicking on the dynamic text link", function() {
            cy.visit("/links");

            cy.get("a").contains(/^Home[a-zA-Z0-9]*[a-zA-Z0-9]/).then($link => {
                cy.wrap($link)
                    .invoke("removeAttr", "target")
                    .click();
    
                cy.url().should("eq", `${$link.attr("href")}/`);
            })
        })

        it("Check that the links making the API call, return the correct response", function() {
            cy.visit("/links");

            cy.intercept("GET", "https://demoqa.com/*").as("apiCall");

            cy.get("h5:contains('Following links will send an api call')")
                .nextUntil("#linkResponse")
                .children()
                .then($links => {
                    $links.each((i, link) => {
                        cy.wrap(link).click();
    
                        cy.wait("@apiCall")
                            .then(interception => interception.response)
                            .then(res => {
                                if("statusCode" in res) {
                                    cy.get("#linkResponse")
                                        .should("have.text", `Link has responded with staus ${res.statusCode} and status text ${res.statusMessage}`);
                                }
                        })
                    })
                })  
        })
    })

    describe("Broken Links", function() {
        it("Confirm images load successfully", function() {
            cy.visit("/broken");

            cy.get(".col-md-6").find("img").each(($img: JQuery<HTMLImageElement>) => {
                cy.wrap($img)
                    .should("be.visible")
                    .and("have.prop", "naturalWidth")
                    .then(naturalWidth => expect(naturalWidth).to.be.greaterThan(0));       
            }) 
        })

        it("Check that the links making the API call, return the correct response status code", function() {
            cy.visit("/broken");

            cy.get(".col-md-6").find("a").each(($link: JQuery<HTMLAnchorElement>) => { 
                if($link.prop("href")) {
                    cy.request({
                        url: $link.prop("href"),
                        failOnStatusCode: false,
                    }).then(response => checkHTTPResponseStatusCode(response, [200], $link))
                }
            })
        })
    })

    describe("Upload and download files", function() {
        it("Download image by clicking on the link", function() {
            deleteDownloadsFolder();

            cy.visit("/upload-download");

            cy.get("#downloadButton").click();
            readFileFromDownloads("sampleFile.jpeg", "base64");
        })

        it("Upload a file using the file selection dialog", function() {
            let fileName = "dog.jpeg";

            cy.visit("/upload-download");
            
            cy.get("input[type='file']")
                .selectFile("cypress/fixtures/dog.jpeg")
                .then($input =>  {
                    const files = ($input[0] as HTMLInputElement).files;
                    if(files) {
                        expect(files[0].name).to.eq("dog.jpeg");
                        expect(files[0].type).to.eq("image/jpeg");
                    }
                })

            cy.get("#uploadedFilePath").should("have.text", `C:\\fakepath\\${fileName}`);
        })
    })
})