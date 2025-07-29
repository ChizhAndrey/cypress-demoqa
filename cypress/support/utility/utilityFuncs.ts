import * as path from 'path';

export function checkParentNodesExpanded($listItems: JQuery<HTMLLIElement>) {
    $listItems.each((_, li) => {
        const isParentNode = li.classList.contains('rct-node-parent');

        if(isParentNode) {
            let spanElement: HTMLElement | null;
            let title = 'unknown';

            const isExpanded = li.classList.contains('rct-node-expanded');

            if(isExpanded) {
                spanElement = li.querySelector('span.rct-title');
                title = spanElement?.textContent?.trim() || title;

                Cypress.log({
                    name: "checkParentNodesExpanded",
                    displayName: "checkParNodExp",
                    message: `Element: ${li.tagName.toLocaleLowerCase()}, title: ${title} expanded`,
                    consoleProps: () => {
                        return {
                            li,
                            title,
                            isExpanded,
                        }
                    },
                })
            } else {
                throw new Error(`The list item with the title ${title} has not been expanded`);
            }
        }
    });
}

export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Deletes the downloads folder.
 */
export const deleteDownloadsFolder = () => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.task('deleteFolder', downloadsFolder);
}

/**
 * Reads a file from a specified folder using the given encoding.
 * @param folder - The folder containing the file.
 * @param filePath - The name of the file to read.
 * @param encoding - The encoding to use for reading the file.
 * @returns A Chainable that resolves with the file content.
 */
export const readFileFromFolder = (folder: string, filePath: string, encoding: Cypress.Encodings) => {
    const fullPath = path.join(folder, filePath);
    return cy.readFile(fullPath, encoding);
}

/**
 * Reads a file from the downloads folder using the given encoding.
 * @param filePath - The name of the file to read.
 * @param encoding - The encoding to use for reading the file.
 * @returns A Chainable that resolves with the file content.
 */
export const readFileFromDownloands = readFileFromFolder.bind(null, Cypress.config("downloadsFolder"));

/**
 * Deletes the contents of a specified folder.
 * @param folderPath - The path to the folder whose contents should be deleted.
 */
export const deleteFolderContents = (folderPath: string) => {
    cy.task("deleteFolderContents", folderPath);
}