import { faker } from "@faker-js/faker";
import { checkTableRowsForSubstring } from "../support/utilityFunctions";
const { _ } = Cypress;  //(Lodash)


interface WebTableEmployeeData {
    firstName: string, 
    lastName: string, 
    email: string, 
    age: number, 
    salary: number, 
    department: string,
}

type THC = keyof WebTableEmployeeData;

class WebTablePage {
    elements = {
        addNewRecordButton: () => cy.get("#addNewRecordButton"),
        regFormFirstNameField: () => cy.get("#firstName"),
        regFormLastNameField: () => cy.get("#lastName"),
        regFormEmailField: () => cy.get("#userEmail"),
        regFormAgeField: () => cy.get("#age"),
        regFormSalaryField: () => cy.get("#salary"),
        regFormDepartmentField: () => cy.get("#department"),
        regFormSubmitButton: () => cy.get("#submit"),
        tableRows: () => cy.get(".rt-tr-group").children(),
        searchBox: () => cy.get("#searchBox"),
        firstNameHeader: () => cy.get(".rt-resizable-header:contains('First Name')"),
        pageSizeSelect: () => cy.get("select[aria-label='rows per page']"),
        pageSizeOptions: () => cy.get("select[aria-label='rows per page'] option"),
        pageChangeInput: () => cy.get("input[aria-label='jump to page']"),
        buttonPreviousPage: () => cy.get("button:contains('Previous')"),
        buttonNextPage: () => cy.get("button:contains('Next')"),
    }

    visit() {
        cy.visit("/webtables");
    }

    enterFirstNameToRegForm(firstName: string) {
        this.elements.regFormFirstNameField().clear().type(firstName);
    }

    enterLastNameToRegForm(lastName: string) {
        this.elements.regFormLastNameField().clear().type(lastName);
    }

    enterEmailToRegForm(email: string) {
        this.elements.regFormEmailField().clear().type(email);
    }

    enterAgeToRegForm(age: number) {
        this.elements.regFormAgeField().clear().type(`${age}`);
    }

    enterSalaryToRegForm(salary: number) {
        this.elements.regFormSalaryField().clear().type(`${salary}`);
    }

    enterDepartmentToRegForm(department: string) {
        this.elements.regFormDepartmentField().clear().type(department);
    }

    submit() {
        this.elements.regFormSubmitButton().click();
    }

    fillAndSubmitRegForm(data: WebTableEmployeeData) {
        this.enterFirstNameToRegForm(data.firstName);
        this.enterLastNameToRegForm(data.lastName);
        this.enterEmailToRegForm(data.email);
        this.enterAgeToRegForm(data.age);
        this.enterSalaryToRegForm(data.salary);
        this.enterDepartmentToRegForm(data.department);
        this.submit();
    }

    createEmployeeDataFromTableRow(data: string[]): WebTableEmployeeData {
        return {
            firstName: data[0],
            lastName: data[1],
            email: data[3],
            age: parseInt(data[2], 10),
            salary: parseInt(data[4], 10),
            department: data[5]
        }
    }

    createArrayObjectsFromTableRows($rows: JQuery<HTMLElement>) {
        const rowsArray: WebTableEmployeeData[] = [];

        $rows.each((i, row) => {
            //Если строка пустая - пропускаем
            if(!row.classList.contains("-padRow")) {
                //Создаем из строки массив значений ячеек
                const rowArray = Array.from(row.children).map(cell => cell.textContent ? cell.textContent : "");

                //Создаем из массива объект и пушим в массив
                rowsArray.push(this.createEmployeeDataFromTableRow(rowArray));
            }
        })

        return cy.wrap(rowsArray, {log: false});
    }

    deleteRowFromTable(employeeEmail: string) {
        this.elements.tableRows()
            .contains(employeeEmail)
            .parent()
            .find("span[title='Delete']")
            .click();  
    }

    updateRowInTable(userEmail: string) {
        this.elements.tableRows()
            .contains(userEmail)
            .parent()
            .find("span[title='Edit']")
            .click();
    }

    filterTableRowsBySearchWord(searchWord: string) {
        this.elements.searchBox()
            .clear()
            .type(searchWord);
    }

    checkTableRowsContainSearchWord(searchWord: string) {
        this.elements.tableRows().then($rows => checkTableRowsForSubstring($rows, searchWord));
    }

    sortTableByFirstName(sortOrder: "asc" | "desc") {
        switch(sortOrder) {
            case "asc": {
                this.elements.firstNameHeader()
                    .click()
                    .then(thc => {
                        expect(thc.attr("class")).to.include("-sort-asc");
                    });
                break;
            }

            case "desc": {
                this.elements.firstNameHeader()
                    .then(thc => {
                        _.times(2, () => cy.wrap(thc).click())
                    }).then(thc => {
                        expect(thc.attr("class")).to.include("-sort-desc");
                    })
                break;
            }
        }
    }

    checkColumnIsSortedInOrder(thc: THC, order: "asc" | "desc") {
        this.elements.tableRows().then($rows => {
            this.createArrayFromTableColumn($rows, thc).then(arr => {
                expect(arr).to.have.ordered.members(_.orderBy(arr, [], order));
            })
        })
    }

    createArrayFromTableColumn($rows: JQuery<HTMLElement>, thc: THC) {
        const arr: string[] = [];

        $rows.each((i, row) => {
            if(row.classList.contains("-padRow")) {
                return;
            }

            switch(thc) {
                case "firstName":
                    arr.push(row.children[0].textContent as string);
                    break;
            }
        })

        return cy.wrap(arr);
    }

    checkScalingOfNumberOfRowsInTable() {
        this.elements.pageSizeOptions().then($options => {
            $options.each(i => {
                this.elements.pageSizeSelect()
                    .select(i)
                    .should("have.value", ($options[i] as HTMLInputElement).value); 

                cy.get(".rt-tr-group").children()
                    .should("have.length", ($options[i] as HTMLInputElement).value);
            })
        })
    }

    fillTableWithGeneratedData(count: number) {
        const employeesData = this.createEmployeesDataForWebTable(count);
        employeesData.forEach(employee => {
            this.elements.addNewRecordButton().click();
            this.fillAndSubmitRegForm(employee);
        })
    }

    goToPreviousTablePage() {
        this.elements.buttonPreviousPage().click();
    }

    goToNextTablePage() {
        this.elements.buttonNextPage().click();
    }

    changePageByInput(pageNumber: number) {
        this.elements.pageChangeInput().type(`${pageNumber}`);
    }

    private createEmployeesDataForWebTable(count: number): WebTableEmployeeData[] {
        const employeesArray: WebTableEmployeeData[] = [];

        for(let i = 0; i < count; i++) {
            const employee: WebTableEmployeeData = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                age: faker.datatype.number({
                    "min": 18,
                    "max": 70
                }),
                salary: Math.round(faker.datatype.number({
                    "min": 1000,
                    "max": 40000
                }) / 1000) * 1000,
                department: faker.name.jobArea()
            }
    
            employeesArray.push(employee);
        }
    
        return employeesArray;
    }
}

const webTablePage = new WebTablePage();

export { webTablePage, WebTableEmployeeData};