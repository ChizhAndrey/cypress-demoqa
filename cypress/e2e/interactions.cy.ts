
describe("Interactions", function() {

    describe("Sortable", function() {
        it("Sort list items", function() {
            cy.visit("/sortable");

            cy.get("#sortableContainer #demo-tabpane-list").within(() => {
                cy.get(`.list-group-item:contains('One')`).as("movedElement"); // moved element
                cy.get(`.list-group-item:contains('Four')`).as("targetElement"); // element we're moving to

                cy.get("@movedElement").then($movedElement => {
                        const movedElemTopPos = $movedElement.offset()?.top;

                        if(movedElemTopPos) {
                            cy.get("@targetElement").then($targetElement => {
                                    const targetElemTopPos = $targetElement.offset()?.top;
                                    const targetElemIndex = $targetElement.index();

                                    if(targetElemTopPos) {
                                        const difference = targetElemTopPos - movedElemTopPos;

                                        cy.get("@movedElement").move({deltaX: 0, deltaY: difference, force: true}).then(() => {
                                            cy.get("@movedElement")
                                                .invoke("index")
                                                .should("be.equal", targetElemIndex);

                                            cy.get("@targetElement")
                                                .invoke("index")
                                                .should("be.equal", Math.sign(difference) == 1 ? targetElemIndex - 1 : targetElemIndex + 1);
                                        })
                                    }
                                })
                        }
                    })
            })
        })

        it("Sort grid items", function() {
            cy.visit("/sortable");

            cy.get("#demo-tab-grid").click();

            cy.get("#sortableContainer .grid-container").within(() => {
                cy.get(`.list-group-item:contains('One')`).as("movedElement"); // moved element
                cy.get(`.list-group-item:contains('Eight')`).as("targetElement"); // element we're moving to

                cy.get("@movedElement").then($movedElement => {
                    const movedElemTopPos = $movedElement.offset()?.top;
                    const movedElemLeftPos = $movedElement.offset()?.left;

                    if(movedElemTopPos && movedElemLeftPos) {
                        cy.get("@targetElement").then($targetElement => {
                            const targetElemTopPos = $targetElement.offset()?.top;
                            const targetElemLeftPos = $targetElement.offset()?.left;
                            const targetElemIndex = $targetElement.index();

                            if(targetElemTopPos && targetElemLeftPos) {
                                const yDifference = targetElemTopPos - movedElemTopPos;
                                const xDiffernce = targetElemLeftPos - movedElemLeftPos;

                                cy.get("@movedElement").move({deltaX: xDiffernce, deltaY: yDifference, force: true}).then(() => {
                                    cy.get("@movedElement")
                                        .invoke("index")
                                        .should("eq", targetElemIndex);

                                    cy.get("@targetElement")
                                        .invoke("index")
                                        .should("eq", (Math.sign(yDifference) == 1 || Math.sign(xDiffernce) == 1) ? targetElemIndex - 1 : targetElemIndex + 1);
                                })
                            }
                        })
                    }
                })
            })
            
        })
    })

    describe("Selectable", function() {
        it("Select list items", function() {
            cy.visit("/selectable");

            cy.get("#demo-tabpane-list").within(() => {
                const textListItems = ["Cras justo odio", "Morbi leo risus"];

                cy.get(".list-group-item")
                    .should("not.have.class", "active")
                    .and("have.css", "background-color", "rgb(255, 255, 255)");

                textListItems.forEach(text => {
                    cy.get(`.list-group-item:contains('${text}')`)
                        .click()
                        .should("have.class", "active")
                        .and("have.css", "background-color", "rgb(0, 123, 255)");
                })

                cy.get(".list-group-item.active").should("have.length", textListItems.length);
            })
        })

        it("Select grid items", function() {
            cy.visit("/selectable");

            cy.get("#demo-tab-grid").click();

            cy.get("#demo-tabpane-grid").within(() => {
                const textGridItems = ["One", "Three", "Five", "Seven", "Nine"];

                cy.get(".list-group-item")
                    .should("not.have.class", "active")
                    .and("have.css", "background-color", "rgb(255, 255, 255)");

                textGridItems.forEach(text => {
                    cy.get(`.list-group-item:contains('${text}')`)
                        .click()
                        .should("have.class", "active")
                        .and("have.css", "background-color", "rgb(0, 123, 255)");
                })

                cy.get(".list-group-item.active").should("have.length", textGridItems.length);
            })
        })
    })

    describe("Resizable", function() {
        it("Check the minimum allowable box size", function() {
            cy.visit("/resizable");

            cy.get("#resizableBoxWithRestriction").within(() => {
                const initialHeight = 200;
                const initialWidth = 200;

                const minWidth = 150;
                const minHeight = 150;

                cy.root()
                    .should("have.css", "width", `${initialWidth}px`)
                    .and("have.css", "height", `${initialHeight}px`);

                cy.get("span").move({deltaX: -1000, deltaY: -1000});

                cy.root()
                    .should("have.css", "width", `${minWidth}px`)
                    .and("have.css", "height", `${minHeight}px`);
            })
        })

        it("Check the maximum allowable box size", function() {
            cy.visit("/resizable");

            cy.get("#resizableBoxWithRestriction").within(() => {
                const initialHeight = 200;
                const initialWidth = 200;

                const maxWidth = 500;
                const maxHeight = 300;

                cy.root()
                    .should("have.css", "width", `${initialWidth}px`)
                    .and("have.css", "height", `${initialHeight}px`);

                cy.get("span").move({deltaX: 1000, deltaY: 1000});

                cy.root()
                    .should("have.css", "width", `${maxWidth}px`)
                    .and("have.css", "height", `${maxHeight}px`);
            })
        })
    })

    describe("Droppable", function() {
        it("Move a draggable element to dropbox", function() {
            cy.visit("/droppable");

            cy.get("#droppableExample-tabpane-simple").within(() => {

                cy.get("#droppable")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .and("have.text", "Drop here");

                cy.get("#draggable")
                    .drag("#droppable", {force: true})
                    .then(success => {
                        expect(success).to.be.true;
                    })

                cy.get("#droppable")
                    .should("have.css", "background-color", "rgb(70, 130, 180)")
                    .and("have.text", "Dropped!");
            })
        })

        it("Move a not acceptable element to dropbox", function() {
            cy.visit("/droppable");

            cy.get("#droppableExample-tab-accept").click();

            cy.get("#droppableExample-tabpane-accept").within(() => {

                cy.get("#droppable")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .and("have.text", "Drop here");

                cy.get("#notAcceptable")
                    .drag("#droppable", {force: true})
                    .then(success => {
                        expect(success).to.be.true;
                    })

                cy.get("#droppable")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .and("have.text", "Drop here");
            })
        })

        it("Check that the event does not bubble from the inner greedy box to the outer one", function() {
            cy.visit("/droppable");

            cy.get("#droppableExample-tab-preventPropogation").click();

            cy.get("#droppableExample-tabpane-preventPropogation").within(() => {
                
                cy.get("#greedyDropBox")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .find("p")
                    .first()
                    .should("have.text", "Outer droppable");
                
                cy.get("#greedyDropBoxInner")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .find("p")
                    .should("have.text", "Inner droppable (greedy)");

                cy.get("#dragBox")
                    .drag("#greedyDropBoxInner", {force: true})
                    .then(success => {
                        expect(success).to.be.true;
                    })

                cy.get("#greedyDropBox")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .find("p")
                    .first()
                    .should("have.text", "Outer droppable");
                
                cy.get("#greedyDropBoxInner")
                    .should("have.css", "background-color", "rgb(70, 130, 180)")
                    .find("p")
                    .should("have.text", "Dropped!");
            })
        })

        it("Check that after moving the revertable element to the dropbox, it returns to its start position", function() {
            cy.visit("/droppable");

            cy.get("#droppableExample-tab-revertable").click();

            cy.get("#droppableExample-tabpane-revertable").within(() => {

                cy.get("#droppable")
                    .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
                    .and("have.text", "Drop here");
                
                cy.get("#revertable")
                    .invoke("offset")
                    .should(coords => {
                        if(coords) {
                            expect(Math.round(coords.top)).to.equal(302);
                            expect(Math.round(coords.left)).to.equal(712);
                        }
                    })

                cy.get("#revertable")
                    .drag("#droppable", {force: true})
                    .then(success => {
                        expect(success).to.be.true;
                    })

                cy.get("#droppable")
                    .should("have.css", "background-color", "rgb(70, 130, 180)")
                    .and("have.text", "Dropped!");

                cy.get("#revertable")
                    .invoke("offset")
                    .should(coords => {
                        if(coords) {
                            expect(Math.round(coords.top)).to.equal(302);
                            expect(Math.round(coords.left)).to.equal(712);
                        }
                    })
            })
        })
    })

    describe("Draggable", function() {
        it("Move the draggable element to the specified point", function() {
            cy.visit("/dragabble");

            const coordsPoint = {x: 1200, y: 700};

            cy.get("#draggableExample-tabpane-simple").within(() => {
                cy.get("#dragBox").then($dragBox => {
                    const dragBoxWidth = $dragBox.outerWidth()!;
                    const dragBoxHeight =$dragBox.outerHeight()!;

                    const currentYPos = $dragBox.offset()?.top;
                    const currentXPos = $dragBox.offset()?.left;

                    if(currentXPos && currentYPos) {
                        cy.wrap($dragBox)
                            .move({
                                deltaX: (coordsPoint.x - currentXPos - dragBoxWidth / 2), 
                                deltaY: (coordsPoint.y - currentYPos - dragBoxHeight / 2),
                                force: true,
                            })
                            .should(() => {
                                const newYPos = $dragBox.offset()?.top;
                                const newXPos = $dragBox.offset()?.left;

                                if(newXPos && newYPos) {
                                    expect(Math.round(newXPos + dragBoxWidth / 2)).to.equal(coordsPoint.x);
                                    expect(Math.round(newYPos + dragBoxHeight / 2)).to.equal(coordsPoint.y);
                                }
                            })
                    }
                })
            })
        })

        it("Check that the draggable element can only move on the x-axis", function() {
            cy.visit("/dragabble");

            cy.get("#draggableExample-tab-axisRestriction").click();

            cy.get("#draggableExample-tabpane-axisRestriction").within(() => {
                cy.get("#restrictedX").then($dragBox => {
                    const currentYPos = $dragBox.offset()?.top;
                    const currentXPos = $dragBox.offset()?.left;

                    if(currentYPos && currentXPos) {
                        cy.wrap($dragBox)
                            .move({deltaX: 100, deltaY: 100, force: true})
                            .should(() => {
                                const newYPos = $dragBox.offset()?.top;
                                const newXPos = $dragBox.offset()?.left;

                                if(newYPos && newXPos) {
                                    expect(Math.round(newYPos)).to.equal(Math.round(currentYPos));
                                    expect(Math.round(newXPos)).to.equal(Math.round(currentXPos + 100));
                                }
                            })
                    }
                })
            })
        })

        it("Check that the draggable element can only move on the y-axis", function() {
            cy.visit("/dragabble");

            cy.get("#draggableExample-tab-axisRestriction").click();

            cy.get("#draggableExample-tabpane-axisRestriction").within(() => {
                cy.get("#restrictedY").then($dragBox => {
                    const currentYPos = $dragBox.offset()?.top;
                    const currentXPos = $dragBox.offset()?.left;

                    if(currentYPos && currentXPos) {
                        cy.wrap($dragBox)
                            .move({deltaX: 100, deltaY: 100, force: true})
                            .should(() => {
                                const newYPos = $dragBox.offset()?.top;
                                const newXPos = $dragBox.offset()?.left;

                                if(newYPos && newXPos) {
                                    expect(Math.round(newXPos)).to.equal(Math.round(currentXPos));
                                    expect(Math.round(newYPos)).to.equal(Math.round(currentYPos + 100));
                                }
                            })
                    }
                })
            })
        })
        
        it("Check that a draggable element's movement is restricted by its parent container", function() {
            cy.visit("/dragabble");

            cy.get("#draggableExample-tab-containerRestriction").click();

            cy.get("#draggableExample-tabpane-containerRestriction").within(() => {
                
                cy.get("#containmentWrapper").within($wrapper => {
                    const wrapWidth= $wrapper.width()!;
                    const wrapHeight = $wrapper.height()!;   

                    cy.get(".draggable").then($dragBox => {
                        const dragBoxOuterWidth = $dragBox.outerWidth(true)!;
                        const dragBoxOuterHeight = $dragBox.outerHeight(true)!;

                        const maxMoveOnXAxis = Math.round(wrapWidth - dragBoxOuterWidth);
                        const maxMoveOnYAxis = Math.round(wrapHeight - dragBoxOuterHeight);

                        cy.wrap($dragBox)
                            .move({deltaX: -2000, deltaY: -2000, force: true})
                            .should("have.css", "left", "0px")
                            .and("have.css", "top", "0px");

                        cy.wrap($dragBox)
                            .move({deltaX: 2000, deltaY: 2000, force: true})
                            .should("have.css", "left", `${maxMoveOnXAxis}px`)
                            .and("have.css", "top", `${maxMoveOnYAxis}px`);
                    })
                    
                })
            })
        })

        it("Check that the cursor sticks to the center of the element", function() {
            cy.visit("/dragabble");

            cy.get("#draggableExample-tab-cursorStyle").click();

            cy.get("#draggableExample-tabpane-cursorStyle").within(() => {
                
                cy.get("#cursorCenter").then($dragBox => {
                    const dragBoxWidth = $dragBox.outerWidth()!;
                    const dragBoxHeight =$dragBox.outerHeight()!;

                    const pixelAccuracy = 8;

                    let cursorXPos: number;
                    let cursorYPos: number;

                    $dragBox.on("mousemove", function(e) {
                        cursorXPos = e.pageX;
                        cursorYPos = e.pageY;
                    });

                    cy.wrap($dragBox)
                        .move({deltaX: 400, deltaY: 200, force: true})
                        .then($dragBoxAfterMove => {
                            cy.wrap($dragBoxAfterMove)
                                .should($dragBoxAfterMove => {
                                    expect(cursorXPos).to.be.closeTo($dragBoxAfterMove.offset()!.left + dragBoxWidth / 2, pixelAccuracy);
                                    expect(cursorYPos).to.be.closeTo($dragBoxAfterMove.offset()!.top + dragBoxHeight / 2, pixelAccuracy);
                            })
                        })
                })
            })
        })

        it("Check that the cursor sticks to the top left corner of an element", function() {
            cy.visit("/dragabble");

            cy.get("#draggableExample-tab-cursorStyle").click();

            cy.get("#draggableExample-tabpane-cursorStyle").within(() => {

                cy.get("#cursorTopLeft").then($dragBox => {
                    const pixelAccuracy = 6;

                    let cursorXPos: number;
                    let cursorYPos: number;

                    $dragBox.on("mousemove", function(e) {
                        cursorXPos = e.pageX;
                        cursorYPos = e.pageY;
                    });

                    cy.wrap($dragBox)
                        .move({deltaX: 400, deltaY: 200, force: true})
                        .then($dragBoxAfterMove => {
                            cy.wrap($dragBoxAfterMove)
                                .should($dragBoxAfterMove => {
                                    expect(cursorXPos).to.be.closeTo($dragBoxAfterMove.offset()!.left, pixelAccuracy);
                                    expect(cursorYPos).to.be.closeTo($dragBoxAfterMove.offset()!.top, pixelAccuracy);
                            })
                    })
                })
            })
        })

        it("Check that the cursor sticks to the bottom of the element", function() {
            cy.visit("/dragabble");

            cy.get("#draggableExample-tab-cursorStyle").click();

            cy.get("#draggableExample-tabpane-cursorStyle").within(() => {
                cy.get("#cursorBottom").then($dragBox => {
                    const dragBoxHeight = $dragBox.outerHeight()!;

                    const pixelAccuracy = 6;

                    let cursorXPos: number;
                    let cursorYPos: number;

                    $dragBox.on("mousemove", function(e) {
                        cursorXPos = e.pageX;
                        cursorYPos = e.pageY;
                    });

                    cy.wrap($dragBox)
                        .move({deltaX: 400, deltaY: 200, force: true})
                        .then($dragBoxAfterMove => {
                            cy.wrap($dragBoxAfterMove)
                                .should($dragBoxAfterMove => {
                                    expect(cursorYPos).to.be.closeTo($dragBoxAfterMove.offset()!.top + dragBoxHeight, pixelAccuracy);
                        })
                    })
                })
            })
        })
    })
})



