import { deleteFolderContents, readFileFromDownloands } from '@utils/utilityFuncs';

describe('Upload and Download', function() {

    beforeEach(() => {
        cy.visit('upload-download');
    })

    it('Download image by clicking on the link', function() {
        const downloadsFolder = Cypress.config('downloadsFolder');

        deleteFolderContents(downloadsFolder);
        cy.get('#downloadButton').click();
        readFileFromDownloands('sampleFile.jpeg', 'base64')
            .should('not.be.empty');
    })

    it('Upload a file using the file selection dialog', function() {
        const fileName = 'dog.jpg';
        const fileType = 'image/jpeg';

        cy.get('input[type="file"]')
            .selectFile(`cypress/fixtures/${fileName}`)
            .should('have.prop', 'files')
            .and('have.length', 1)
            .then((files: FileList) => {
                const file = files[0];

                expect(file.name).to.eq(fileName);
                expect(file.type).to.eq(fileType);
            });

        cy.get('#uploadedFilePath')
            .should('have.text', `C:\\fakepath\\${fileName}`);
    })
})