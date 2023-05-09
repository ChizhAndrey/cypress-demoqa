
describe("Interaction with alerts, frames and windows", function() {

    describe("Browser windows", function() {
        it("Open a new tab by clicking on the button", function() {
            cy.visit("/browser-windows").then(win => {
                cy.spy(win, "open").as("open");
            })

            cy.get("#tabButton").click();

            cy.get("@open")
                .should("have.been.calledOnceWith", "/sample")
                .its("firstCall.returnValue")
                .should((childWindow: Window)=> {
                    expect(childWindow.document.body.innerText).to.equal("This is a sample page");
                })
        })

        it("Open a new window by clicking on the button", function() {
            cy.visit("/browser-windows").then(win => {
                cy.spy(win, "open").as("open");
            })

            cy.get("#windowButton").click();

            cy.get("@open")
                .should("have.been.calledOnceWith", "/sample", "_blank", Cypress.sinon.match.string)
                .its("firstCall.returnValue")
                .should((childWindow: Window) => {
                    expect(childWindow.document.body.innerText).to.equal("This is a sample page");
                })
        })

        it("Open a new window message by clicking on the button", function() {
            cy.visit("/browser-windows").then(win => {
                cy.spy(win, "open").as("open");
            })

            cy.get("#messageWindowButton").click();

            cy.get("@open")
                .should("have.been.calledOnceWith", "", "MsgWindow", Cypress.sinon.match.string)
                .its("firstCall.returnValue")
                .should((childWindow: Window) => {
                    expect(childWindow.document.body.innerText).to.contain("Knowledge");
                })
        })
    })

    describe("Alerts, prompts and confirmations", function() {
        it("Open modal alert windows by clicking on the button", function() {
            cy.visit("/alerts").then(win => {
                cy.stub(win, "alert").as("alert");
            })

            cy.get("#alertButton").click();
            cy.get("@alert")
                .its("firstCall.args.0")
                .should("be.equal", "You clicked a button");

            cy.get("#timerAlertButton").click();
            cy.get("@alert")
                .its("secondCall.args.0", {timeout: 5100})
                .should("be.equal", "This alert appeared after 5 seconds");

        })

        it("Check that the resulting text matches the answer selected in the modal question window", function() {
            cy.visit("/alerts").then(win => {
                cy.stub(win, "confirm")
                    .as("confirm")
                    .onFirstCall()
                    .returns(true)
                    .onSecondCall()
                    .returns(false);
            })

            cy.get("#confirmButton").click();
            cy.get("#confirmResult").should("have.text", "You selected Ok");

            cy.get("#confirmButton").click();
            cy.get("#confirmResult").should("have.text", "You selected Cancel");

            cy.get("@confirm").should("always.have.been.calledWith", "Do you confirm action?");
        })

        it("Check that the resulting text matches the answer entered in the modal question window", function() {
            cy.visit("/alerts").then(win => {
                cy.stub(win, "prompt")
                    .as("prompt")
                    .returns("Andrey Chizh");
            })

            cy.get("#promtButton").click();
            cy.get("@prompt").should("have.be.calledOnceWith", "Please enter your name");
            cy.get("#promptResult").should("have.text", `You entered Andrey Chizh`);
        })
    })

    describe("Frames", function() {
        it("Check the HTML source in frames", function() {
            cy.visit("/frames");

            cy.getIframeBody("#frame1")
                .find("h1[id='sampleHeading']")
                .should("have.text", "This is a sample page");

            cy.getIframeBody("#frame2")
                .find("h1[id='sampleHeading']")
                .should("have.text", "This is a sample page");
        })
    })

    describe("Nested frames", function() {
        it("Check the HTML source in nested frames", function() {
            cy.visit("/nestedframes");

            cy.getIframeBody("#frame1")
                .should("have.text", "Parent frame")
                .within(() => {
                    cy.getIframeBody("iframe[srcdoc='<p>Child Iframe</p>']") //???
                        .find("p")
                        .should("have.text", "Child Iframe");
                })
        })
    })

    describe("Modal dialogs", function() {
        it("Open modal dialogs by clicking on the buttons", function() {
            cy.visit("/modal-dialogs");

            cy.get("#showSmallModal").click();
            cy.get("div[role='dialog'] .modal-content").within(() => {
                cy.get(".modal-header .modal-title.h4").should("have.text", "Small Modal");
                cy.get(".modal-body").should("have.text", "This is a small modal. It has very less content");
                cy.get("#closeSmallModal").click();
            })
        
            cy.get("#showLargeModal").click();
            cy.get("div[role='dialog'] .modal-content").within(() => {
                cy.get(".modal-header .modal-title.h4").should("have.text", "Large Modal");
                cy.get(".modal-body").should("include.text", "Lorem Ipsum passages, and more recently with desktop");
                cy.get("button[class='close']").click();
            })
        })
    })
})