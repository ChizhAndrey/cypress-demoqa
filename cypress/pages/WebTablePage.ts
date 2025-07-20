const { _ } = Cypress;  //(Lodash)

interface WebTableEmployeeData {
    firstName: string, 
    lastName: string, 
    email: string, 
    age: number, 
    salary: number, 
    department: string,
}

type ColumnHeader = keyof WebTableEmployeeData;

type TableSize = '5' | '10' | '20' | '25' | '50' | '100';

const columnHeaderMap: Record<ColumnHeader, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    age: 'Age',
    salary: 'Salary',
    department: 'Department',
}

class WebTablePage {
    elements = {
        webTableWrapper: () => cy.get('.web-tables-wrapper'),
        newRecordBtn: () => cy.get('#addNewRecordButton'),
        regFormFirstNameField: () => cy.get("#firstName"),
        regFormLastNameField: () => cy.get("#lastName"),
        regFormEmailField: () => cy.get("#userEmail"),
        regFormAgeField: () => cy.get("#age"),
        regFormSalaryField: () => cy.get("#salary"),
        regFormDepartmentField: () => cy.get("#department"),
        regFormSubmitBtn: () => cy.get("#submit"),
        tableRows: () => cy.get('.rt-tr-group').children(),
        filledTableRows: () => cy.get('.rt-tr-group').children().not('.-padRow'),
        searchBox: () => cy.get('#searchBox'),
        firstNameHeader: () => cy.get('.rt-resizable-header:contains("First Name")'),
        pageSizeSelect: () => cy.get("select[aria-label='rows per page']"),
    }

    visit() {
        cy.visit('/webtables');
        this.elements.webTableWrapper().should('be.visible');
        return this;
    }

    openRegForm() {
        this.elements.newRecordBtn().click();
        return this;
    }

    enterFirstName(firstName: WebTableEmployeeData['firstName']) {
        this.elements.regFormFirstNameField().clear().type(firstName);
        return this;
    }

    enterLastName(lastName: WebTableEmployeeData['lastName']) {
        this.elements.regFormLastNameField().clear().type(lastName);
        return this;
    }

    enterEmail(email: WebTableEmployeeData['email']) {
        this.elements.regFormEmailField().clear().type(email);
        return this;
    }

    enterAge(age: WebTableEmployeeData['age']) {
        this.elements.regFormAgeField().clear().type(`${age}`);
        return this;
    }

    enterSalary(salary: WebTableEmployeeData['salary']) {
        this.elements.regFormSalaryField().clear().type(`${salary}`);
        return this;
    }

    enterDepartment(department: WebTableEmployeeData['department']) {
        this.elements.regFormDepartmentField().clear().type(department);
        return this;
    }

    submitRegForm() {
        this.elements.regFormSubmitBtn().click();
        return this;
    }

    private fillAndSubmitRegFormCommon(data: WebTableEmployeeData) {
        this
          .enterFirstName(data.firstName)
          .enterLastName(data.lastName)
          .enterEmail(data.email)
          .enterAge(data.age)
          .enterSalary(data.salary)
          .enterDepartment(data.department)
          .submitRegForm();

        return this;
    }

    fillAndSubmitNewRegForm(data: WebTableEmployeeData) {
        this
            .openRegForm()
            .fillAndSubmitRegFormCommon(data);

        return this;
    }

    fillAndSubmitEditRegForm(data: WebTableEmployeeData) {
        this.fillAndSubmitRegFormCommon(data);
        return this;
    }

    private mapFilledTableRowsToObjectArray() {
        const tableData: WebTableEmployeeData[] = [];

        this.elements.filledTableRows().each(($row: JQuery<HTMLDivElement>) => {
            //Преобразуем строку таблицы в массив значений ячеек
            const rowData = Array.from($row.children()).map(cell => cell.textContent ? cell.textContent : '');

            //Преобразовываем массив значений в объект и пушим
            tableData.push(this.createEmployeeDataFromTableRow(rowData));
        })

        return tableData;
    }

    private createEmployeeDataFromTableRow(data: string[]): WebTableEmployeeData {
        return {
            firstName: data[0],
            lastName: data[1],
            email: data[3],
            age: parseInt(data[2], 10),
            salary: parseInt(data[4], 10),
            department: data[5]
        }
    }

    assertTableRowExists(data: WebTableEmployeeData ) {
        cy.wrap(this.mapFilledTableRowsToObjectArray(), {log: false}).should('deep.include', data);
        return this;
    }

    assertEmployeeNotExists(employeeEmail: string) {
        webTablePage.elements.filledTableRows().should('not.contain', employeeEmail);
        return this;
    } 

    deleteTableRow(employeeEmail: string) {
        this.elements.filledTableRows()
            .contains(employeeEmail)
            .parent()
            .find('span[title="Delete"]')
            .click(); 

        return this;
    }

    updateTableRow(employeeEmail: string) {
        this.elements.filledTableRows()
            .contains(employeeEmail)
            .parent()
            .find('span[title="Edit"]')
            .click();

        return this;
    }

    filterTableBySearchWord(searchWord: string) {
        this.elements.searchBox().clear().type(searchWord);
        return this;
    }

    checkTableRowsContainSearchWord(searchWord: string) {
        this.elements.filledTableRows().then(($rows: JQuery<HTMLElement>) => this.checkTableRowsForSubstring($rows, searchWord));
    }

    private checkTableRowsForSubstring($rows: JQuery<HTMLElement>, searchWord: string) {
        //String.prototype.includes() чувствителен к регистру.
        //Можно обойти это ограничение, преобразовав как исходную строку, так и строку поиска в нижний регистр.
        searchWord = searchWord.toLocaleLowerCase();

        $rows.each((i, row) => {
            //Создаем из строки массив значений ячеек
            const rowArray = Array.from(row.children).map(cell => cell.textContent ? cell.textContent : "");

            let stringThatContainsSubstring!: string;
            const isIncludes = rowArray.some(str => {
                stringThatContainsSubstring = str;
                return str.toLocaleLowerCase().includes(searchWord);
            });

            if(isIncludes) {
                Cypress.log({
                    name: 'checkTableRowsForSubstring',
                    displayName: 'checkTableRowsForSubstring',
                    message: `The string '${stringThatContainsSubstring}' contains a substring '${searchWord}'`,
                    consoleProps: () => {
                        return {
                            row,
                            isIncludes,
                        }
                    },
                })
            } else {
                throw new Error('Not all rows contain a substring');
            }
        })
    }

    setColumnSort(columnHeader: ColumnHeader, direction: 'asc' | 'desc') {
        cy.clickUntil(`.rt-resizable-header:contains(${columnHeaderMap[columnHeader]})`, () => this.isColumnSorted(columnHeader, direction), 3);
        return this;
    }

    private isColumnSorted(columnHeader: ColumnHeader, direction: 'asc' | 'desc') {
        return cy.get(`.rt-resizable-header:contains(${columnHeaderMap[columnHeader]})`).then(($colHeader: JQuery<HTMLElement>) => {
            return $colHeader.hasClass(`-sort-${direction}`);
        })
    }

    assertTableIsSortedAsc(columnHeader: ColumnHeader ) {
        this.checkColumnIsSortedInOrder(columnHeader, 'asc');
        return this;
    }

    assertTableIsSortedDesc(columnHeader: ColumnHeader ) {
        this.checkColumnIsSortedInOrder(columnHeader, 'desc');
        return this;
    }

    private checkColumnIsSortedInOrder(columnHeader: ColumnHeader, order: "asc" | "desc") {
        this.elements.filledTableRows().then($rows => {
            this.createArrayFromTableColumn($rows, columnHeader).then((arr: string[]) => {
                expect(arr).to.have.ordered.members(_.orderBy(arr, [], order));
            });
        });
    }

    private createArrayFromTableColumn($rows: JQuery<HTMLElement>, columnHeader: ColumnHeader) {
        const arr: string[] = [];

        const indexMap: Record<ColumnHeader, number> = {
            firstName: 0,
            lastName: 1,
            age: 2,
            email: 3,
            salary: 4,
            department: 5,
        };

        const index = indexMap[columnHeader];

        $rows.each((i, $row) => {
            const text = $row.children[index]?.textContent?.trim() || '';
            arr.push(text);
        });

        return cy.wrap(arr);
    }

    changeTablePageSize(size: TableSize) {
        this.elements.pageSizeSelect()
                .select(size)
                .should("have.value", size);

        return this;
    }

    assertTablePageSize(size: TableSize) {
        this.elements.tableRows().should('have.length', size);
        return this;
    }
}

const webTablePage = new WebTablePage();

export { webTablePage };
export type { WebTableEmployeeData, TableSize }