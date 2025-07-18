import { radioBtnPage } from "../../../pages/RadioBtnPage";

describe('Radio button', function() {
    beforeEach(() => {
        radioBtnPage.visit();
    })

    it('Check the radio button', function() {
        const id = 'impressiveRadio';
        const text = 'Impressive';

        radioBtnPage
            .checkRadioBtn(id)
            .assertTextSuccessHaveText(text);
    })

    it('Demonstration: select disabled radio by force', function() {
        const id = 'noRadio';

        radioBtnPage.getRadioBtnById(id).should('be.disabled');
        radioBtnPage.getLabelForInputId(id).should('have.class', 'disabled');

        radioBtnPage
            .getRadioBtnById(id)
            .check({ force: true });
    })
})