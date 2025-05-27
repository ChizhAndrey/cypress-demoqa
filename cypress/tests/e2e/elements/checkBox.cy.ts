import { checkBoxPage } from '../../../pages/CheckBoxPage';

describe('Checkbox', function() {

    beforeEach(() => {
        checkBoxPage.visit();
    })

    it('Expand all checkboxes', function() {
        checkBoxPage
            .expandAllNodes()
            .assertParentNodesExpanded();
    });

    it('Collapse all checkboxes', function() {
        checkBoxPage
            .expandAllNodes()
            .collapseAllNodes()
            .assertParentNodesCollapsed();
    });

    it('Check the checkboxes in the list', function() {
        checkBoxPage
            .expandAllNodes()
            .checkNode('angular')
            .assertNodeIsChecked('angular')
            .checkNode('react')
            .assertNodeIsChecked('react')
            .verifyResultContains(['react', 'angular']);
    });
})