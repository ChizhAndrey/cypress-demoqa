import "cypress-real-events";

describe("Widgets", function() {

    describe("Accordian", function() {
        it("Check that only one accordion tab can be open at a time", function() {
            cy.visit("/accordian");

            cy.get("#section2Content").should("not.be.visible");
            cy.get("#section3Content").should("not.be.visible");
            cy.get("#section1Content")
                .should("be.visible")
                .and("include.text", "Lorem");

            cy.get("#section3Heading").click();
            cy.get("#section1Content").should("not.be.visible");
            cy.get("#section2Content").should("not.be.visible");
            cy.get("#section3Content")
                .should("be.visible")
                .and("include.text", "It is a long established fact");
        })
    })

    describe("Autocomplete", function() {
        it("Autocomplete for text field with multiple color name options", function() {
            const colors = ["Red", "White", "Green"];

            cy.visit("/auto-complete");

            cy.get("#autoCompleteMultiple").within(() => {
                colors.forEach((color, i) => {
                    if(i === 0) cy.get("#autoCompleteMultipleInput").clear();    

                    cy.get("#autoCompleteMultipleInput").type(color.slice(0, 2));
                    cy.get(".auto-complete__menu-list")
                        .children()
                        .first()
                        .should("contain", color);
                    cy.get("#autoCompleteMultipleInput").type("{enter}");
                })

                cy.get(".auto-complete__multi-value").each(($el, i) => {
                    expect($el.text()).to.be.equal(colors[i]);
                })  
            })
        })

        it("Autocomplete for text field with only one color name value", function() {
            const colors = ["White", "Green"];

            cy.visit("/auto-complete");

            cy.get("#autoCompleteSingle").within(() => {
                colors.forEach((color, i) => {
                    if(i === 0) cy.get("#autoCompleteSingleInput").clear();

                    cy.get("#autoCompleteSingleInput").type(color.slice(0, 2));
                    cy.get(".auto-complete__menu-list")
                        .children()
                        .first()
                        .should("contain", color);
                    cy.get("#autoCompleteSingleInput").type("{enter}");

                    cy.get(".auto-complete__single-value").should("have.text", color);
                })
            })
        })
    })

    describe("Date picker", function() {
        function formatDateForSelection(date: Date, withTime?: boolean) {
            const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
            function nthNumber(number: number) {
                return number > 0 ? ["th", "st", "nd", "rd"][(number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10]: "";
            };
            
            return {
                year: `${date.getFullYear()}`,
                month: `${months[date.getMonth()]}`,
                day: `${date.getDate()}`,
                dayWithMonth: `${months[date.getMonth()]} ${date.getDate()}${nthNumber(date.getDate())}`,
                time: withTime ? `${date.getHours()}:${date.getMinutes()}` : "",
                twelveHourFormatTime: `${date.toLocaleString("ru-RU", {hour: 'numeric', minute: 'numeric', hour12: true})}`,
            }
        }

        it("Select the date in the date picker", function() {
            const date = "1994-10-14";
            const dateObj = formatDateForSelection(new Date(date));

            cy.visit("/date-picker");
            cy.get("#datePickerMonthYearInput").click();
            cy.get(".react-datepicker__month-select").select(dateObj.month);
            cy.get(".react-datepicker__year-select").select(dateObj.year);
            cy.get(`.react-datepicker__day[aria-label*="${dateObj.dayWithMonth}"]`).click();

            cy.get("#datePickerMonthYearInput")
                .should("have.value", `${date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1")}`); 
        })

        it("Select the date and time in the date picker", function() {
            const dateWithTime = "2007-07-07:06:45:00";
            const dateWithTimeObj = formatDateForSelection(new Date(dateWithTime), true);

            cy.visit("/date-picker");

            cy.get("#dateAndTimePickerInput").click();
            cy.get(".react-datepicker__month-read-view").click();
    
            cy.get(".react-datepicker__month-option")
                .contains(dateWithTimeObj.month)
                .click();

            cy.get(".react-datepicker__year-read-view").click();
            cy.get(".react-datepicker__year-option").then($opt => {
                const firstOption = $opt[1].textContent!; //2028
                const lastOption = $opt[$opt.length - 2].textContent!; //2018

                if(dateWithTimeObj.year >= lastOption && dateWithTimeObj.year <= firstOption) {
                    cy.get(".react-datepicker__year-option")
                        .contains(dateWithTimeObj.year)
                        .click();
                } else {
                    const difference = (dateWithTimeObj.year < lastOption) 
                        ? +lastOption - +dateWithTimeObj.year 
                        : +dateWithTimeObj.year - +firstOption; 

                    if(dateWithTimeObj.year < lastOption) {
                        cy.get(".react-datepicker__navigation--years-previous").click(5, 5, {clicks: difference});
                    } else {
                        cy.get(".react-datepicker__navigation--years-upcoming").click(5, 5, {clicks: difference});
                    }

                    cy.get(".react-datepicker__year-option")
                            .contains(dateWithTimeObj.year)
                            .click();
                }
            })

            cy.get(`.react-datepicker__day[aria-label*="${dateWithTimeObj.dayWithMonth}"]`).click();

            cy.get(".react-datepicker__time-list-item ")
                .contains(dateWithTimeObj.time)
                .click();
            
            cy.get("#dateAndTimePickerInput")
                .should("have.value", `${dateWithTimeObj.month} ${dateWithTimeObj.day}, ${dateWithTimeObj.year} ${dateWithTimeObj.twelveHourFormatTime}`);
        })
    })

    describe("Slider", function() {
        it("Move slider", function() {
            const position = 88; //0 => 100
            const calculation = 10 - position * 0.2;

            cy.visit("/slider");
   
            cy.get("input[type='range']").should("have.attr", "value", 25);
            cy.get("#sliderValue").should("have.attr", "value", 25);

            cy.get("#sliderContainer").within(() => {
                cy.get("input[type='range']")
                    .invoke("width")
                    .then(width => {
                        if(width) {
                            cy.get("input[type='range']")
                                .realClick({position: {x: (width / 100 * position) + calculation, y: 0}});
                        }
                    })
            });

            cy.get("input[type='range']").should("have.attr", "value", 88);
            cy.get("#sliderValue").should("have.attr", "value", 88);
        })
    })

    describe("Progress bar", function() {
        it("Resuming the progress bar", function() {
            cy.visit("/progress-bar");

            //Checking initial properties
            cy.get("#progressBarContainer").within(() => {
                cy.get("div[role='progressbar']")
                    .should("have.attr", "aria-valuenow", 0)
                    .and("have.class", "bg-info")
                    .and("have.css", "background-color", "rgb(23, 162, 184)");

                //Start progressbar
                cy.get("button")
                    .contains("Start")
                    .click();

                //Stop progressbar at 40%
                cy.get("div[role='progressbar']")
                    .should("have.attr", "aria-valuenow", 40)
                    .then(() => {
                        cy.get("button")
                            .contains("Stop")
                            .click();
                    });

                //Resuming progressbar
                cy.get("button").contains("Start").click();

                //Checking properties on completion
                cy.get("div[role='progressbar']", {timeout: 6000})
                    .should("have.attr", "aria-valuenow", 100)
                    .and("have.class", "bg-success")
                    .and("have.css", "background-color", "rgb(40, 167, 69)");
            })
        })

        it("Resetting the progress bar", function() {
            cy.visit("/progress-bar");

            //Checking initial properties
            cy.get("#progressBarContainer").within(() => {
                cy.get("div[role='progressbar']")
                    .should("have.attr", "aria-valuenow", 0)
                    .and("have.class", "bg-info")
                    .and("have.css", "background-color", "rgb(23, 162, 184)");

                //Start progressbar
                cy.get("button")
                    .contains("Start")
                    .click();

                //Checking properties on completion
                cy.get("div[role='progressbar']", {timeout: 10000})
                    .should("have.attr", "aria-valuenow", 100)
                    .and("have.class", "bg-success")
                    .and("have.css", "background-color", "rgb(40, 167, 69)");

                //Reset progressbar
                //Doesn't work without wait()
                //If you want to reset without wait() results in reset and run at the same time
                cy.wait(100);
                cy.get("button")
                    .contains("Reset")
                    .click();
            
                //Checking properties after reset
                cy.get("button").should("have.text", "Start");
                cy.get("div[role='progressbar']")
                    .should("have.attr", "aria-valuenow", 0)
                    .and("have.class", "bg-info")
                    .and("have.css", "background-color", "rgb(23, 162, 184)");
            })
        })
    })

    describe("Tabs", function() {
        it("Switching tabs", function() {
            cy.visit("/tabs");

            //Check the initial state of the active tab title
            cy.get("#demo-tab-what")
                .should("have.attr", "aria-selected", "true")
                .and("have.class", "active")
                .and("have.css", "color", "rgb(73, 80, 87)");
            
            //Check the initial state of the active tab text
            cy.get("#demo-tabpane-what")
                .should("be.visible")
                .and("have.attr", "aria-hidden", "false")
                .and("have.class", "active")
                .and("have.class", "show")
                .and("contain.text", "Lorem Ipsum is simply dummy text");

            //Check the initial state of inactive tab title
            cy.get("#demo-tab-origin")
                .should("have.attr", "aria-selected", "false")
                .and("not.have.class", "active")
                .and("have.css", "color", "rgb(0, 123, 255)");
            
            //Check initial state of inactive tab text
            cy.get("#demo-tabpane-origin")
                .should("not.be.visible")
                .and("have.attr", "aria-hidden", "true")
                .and("not.have.class", "active")
                .and("not.have.class", "show");

            //Switching to origin tab
            cy.get("#demo-tab-origin").click();

            //Check properties after switching
            cy.get("#demo-tab-origin")
                .should("have.attr", "aria-selected", "true")
                .and("have.class", "active")
                .and("have.css", "color", "rgb(73, 80, 87)");
            
            cy.get("#demo-tabpane-origin")
                .should("be.visible")
                .and("have.attr", "aria-hidden", "false")
                .and("have.class", "active")
                .and("have.class", "show")
                .and("contain.text", "Contrary to popular belief, Lorem Ipsum");

            
            cy.get("#demo-tab-what")
                .should("have.attr", "aria-selected", "false")
                .and("not.have.class", "active")
                .and("have.css", "color", "rgb(0, 123, 255)");
            
            cy.get("#demo-tabpane-what")
                .should("not.be.visible")
                .and("have.attr", "aria-hidden", "true")
                .and("not.have.class", "active")
                .and("not.have.class", "show");
        })
    })

    describe("Tool tips", function() {
        it("Check the text of the tooltips that appears when you hover over the elements", function() {
            cy.visit("/tool-tips");

            //Hover over the button
            cy.get("#toolTipButton")
                .realHover()
                .then(() => {
                    cy.get("div[role='tooltip']")
                        .should("be.visible")
                        .and("have.attr", "id", "buttonToolTip");
                
                    cy.get("div[role='tooltip'] .tooltip-inner")
                        .should("have.text", "You hovered over the Button");
                });

            //Hover over the text field
            cy.get("#texFieldToolTopContainer")
                .realHover()
                .then(() => {
                    cy.get("div[role='tooltip']")
                        .should("be.visible")
                        .and("have.attr", "id", "textFieldToolTip");
                
                    cy.get("div[role='tooltip'] .tooltip-inner")
                        .should("have.text", "You hovered over the text field");
                });

            //Hover over the link contains "Contrary"
            cy.get("a:contains('Contrary')")
                .realHover()
                .then(() => {
                    cy.get("div[role='tooltip']")
                        .should("be.visible")
                        .and("have.attr", "id", "contraryTexToolTip");
                    
                    cy.get("div[role='tooltip'] .tooltip-inner")
                        .should("have.text", "You hovered over the Contrary");
                });

            //Hover over the link contains "1.10.32"
            cy.get("a:contains('1.10.32')")
                .realHover()
                .then(() => {
                    cy.get("div[role='tooltip']")
                        .should("be.visible")
                        .and("have.attr", "id", "sectionToolTip");
                
                    cy.get("div[role='tooltip'] .tooltip-inner")
                        .should("have.text", "You hovered over the 1.10.32");
                });
        })
    })

    describe("Menu", function() {
        it("Check color change of selected menu items", function() {
            cy.visit("/menu");

            cy.get("#nav").within(() => {
                cy.get("li:contains('Main Item 2')")
                    .should("have.css", "background-color", "rgb(36, 175, 21)")
                    .realHover()
                    .should("have.css", "background-color", "rgb(0, 63, 32)")
                    .find("ul")
                    .first()
                    .within(() => {
                        cy.get("li:contains('SUB SUB LIST')")
                            .should("have.css", "background-color", "rgb(36, 175, 21)")
                            .realHover()
                            .should("have.css", "background-color", "rgb(0, 63, 32)")
                            .find("ul")
                            .within(() => {
                                cy.get("li:contains('Sub Sub Item 2')")
                                    .should("have.css", "background-color", "rgb(36, 175, 21)")
                                    .realHover()
                                    .should("have.css", "background-color", "rgb(0, 63, 32)");
                            })
                    })  
            })
        })
    })

    describe("Select menu", function() {
        it("Select values in old and new interface elements", function() {
            cy.visit("/select-menu");

            cy.get("#selectMenuContainer").within(() => {
                cy.get("#withOptGroup").within(() => {
                    cy.root()
                        .click()
                        .contains("Group 2, option 1")
                        .click();

                    cy.get("[class$='-singleValue']").should("have.text", "Group 2, option 1");
                })

                cy.get("#selectOne").within(() => {
                    cy.root()
                        .click()
                        .contains("Prof.")
                        .click();

                    cy.get("[class$='-singleValue']").should("have.text", "Prof.");
                })

                cy.get("#oldSelectMenu")
                    .select("Yellow")
                    .find("option:selected")
                    .should("have.text", "Yellow");

                cy.get(".row:contains('Multiselect drop down') div[class$='container']").within(() => {
                    const colors = ["Blue", "Red"];

                    cy.get("input").clear({force: true}); 

                    colors.forEach((color, i) => {
                        cy.get("input").type(`${color}{enter}`);
                        if(i == colors.length - 1) cy.root().click("right");
                    })

                    cy.get("[class$='-multiValue']").each(($elem, i) => {
                        expect($elem.text()).to.equal(colors[i]);
                    })
                })

                cy.get("#cars")
                    .select(["volvo", "opel"])
                    .invoke("val")
                    .should("deep.equal", ["volvo", "opel"]);
            })
        })
    })
})