import * as path from "path";
const { _ } = Cypress;  //(Lodash)

export const checkParentNodesExpanded = ($elements: JQuery<HTMLElement>) => {
    $elements.each((i, el) => {
        const isParentNode = el.classList.contains("rct-node-parent");

        if(isParentNode) {
            const isExpanded = el.classList.contains("rct-node-expanded");

        if(isExpanded) {
            Cypress.log({
                name: "checkParentNodesExpanded",
                displayName: "checkParNodExp",
                message: `${el.tagName.toLocaleLowerCase()} expanded`,
                consoleProps: () => {
                    return {
                        el,
                        isExpanded,
                    }
                },
            })
        } else {
            throw new Error("Not all parent list nodes are expanded");
        }
    }
  }) 
}

export const checkTableRowsForSubstring = ($rows: JQuery<HTMLElement>, searchWord: string) => {
    //String.prototype.includes() чувствителен к регистру.
    //Можно обойти это ограничение, преобразовав как исходную строку, так и строку поиска в нижний регистр.
    searchWord = searchWord.toLocaleLowerCase();

    $rows.each((i, row) => {
        //Если строка пустая - пропускаем
        if(!row.classList.contains("-padRow")) {
            //Создаем из строки массив значений ячеек
            const rowArray = Array.from(row.children).map(cell => cell.textContent ? cell.textContent : "");

            let stringThatContainsSubstring!: string;
            const isIncludes = rowArray.some(str => {
                stringThatContainsSubstring = str;
                return str.toLocaleLowerCase().includes(searchWord);
            });

            if(isIncludes) {
                Cypress.log({
                    name: "checkTableRowsForSubstring",
                    displayName: "checkTableRowsForSubstring",
                    message: `The string "${stringThatContainsSubstring}" contains a substring "${searchWord}"`,
                    consoleProps: () => {
                        return {
                            row,
                            isIncludes,
                        }
                    },
                })
            } else {
                throw new Error("Not all rows contain a substring");
            }
      }
  })
}

export const checkHTTPResponseStatusCode = (response: Cypress.Response<any>, statusCodes: number[], $el?: JQuery<HTMLElement>) => {
    const url = response.allRequestResponses.at(-1)["Request URL"];

    if(_.includes(statusCodes, response.status)) {
        Cypress.log({
            $el,
            name: "Request",
            displayName: "request",
            message: `${response.status} ${url}`,
            consoleProps: () => {
                return {
                  "Url": url,
                  "Status code": response.status,
                }
            },
        });
    } else {
        Cypress.log({
            $el,
            name: "Request",
            displayName: "request",
            message: `${response.status} ${url}`,
        });
        throw new Error(`${response.status} ${response.statusText} \n${url}`);  
    }
}

//Устанавливает задачу на удаление папки "downloads".
export const deleteDownloadsFolder = () => {
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.task("deleteFolder", downloadsFolder);
}
  
//Читает файл из папки используя заданную кодировку.
export const readFileFromFolder = (folder: string, filePath: string, encoding: Cypress.Encodings) => {
    const fullPath = path.join(folder, filePath);
    return cy.readFile(fullPath, encoding);
}

//Читает файл из папки "donwloads" используя переданную кодировку.
export const readFileFromDownloands = readFileFromFolder.bind(null, Cypress.config("downloadsFolder"));

export const deleteFolderContents = (folderPath: string) => {
    cy.task("deleteFolderContents", folderPath);
}

export const writeDataToFixtureFile = (folderPath: number | string | Buffer | URL, data: string | NodeJS.ArrayBufferView) => {
    const fixturesFolder = Cypress.config("fixturesFolder");

    if(typeof fixturesFolder === "string") {
        const fullPath = path.join(fixturesFolder, `${folderPath}`);
        cy.task("writeDataToFile", {path: fullPath, data});
    }
}

export const copyFile = (src: string | Buffer | URL, dst: string | Buffer | URL, flags?: number) => {
    cy.task("copyFile", {src, dst, flags});
}

export const loginByFormInTheBookStoreApp = (userName: string, password: string) => {
    cy.session(["loginByForm", userName], () => {
        cy.visit("/login");

        cy.get("[placeholder='UserName']")
            .clear()
            .type(userName);
            
        cy.get("[placeholder='Password']")
            .clear()
            .type(password);

        cy.get("button:contains('Login')").click();

        cy.url().should("equal", Cypress.config().baseUrl + "profile");
        cy.get("#userName-value").should("have.text", userName);
    });
}