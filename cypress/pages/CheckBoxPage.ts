import { checkParentNodesExpanded } from "../support/utilityFunctions";


class CheckBoxPage {
    elements = {
        expandButton: () => cy.get("button[aria-label='Expand all']"),
        collapseButton: () => cy.get("button[aria-label='Collapse all']"),
        setOfListItemsOfCheckboxTree: () => cy.get("#tree-node ol li"),
        reactCheckBoxInput: () => cy.get("#tree-node-react"),
        reactCheckBoxSpan: () => cy.get("label[for='tree-node-react']").find("span[class='rct-checkbox']"),
        angularCheckBoxInput: () => cy.get("#tree-node-angular"),
        angularCheckBoxSpan: () => cy.get("label[for='tree-node-angular']").find("span[class='rct-checkbox']"),
        result: () => cy.get("#result .text-success"),
    }

    visit() {
        cy.visit("/checkbox");
    }

    expandAllListItems() {
        this.elements.expandButton().click();
    }

    collapseAllListItems() {
        this.elements.collapseButton().click();
    }

    checkReactCheckBox() {
        this.elements.reactCheckBoxSpan().click();
    }

    checkAngularCheckBox() {
        this.elements.angularCheckBoxSpan().click();
    }

    checkParentListNodesExpanded() {
        this.elements.setOfListItemsOfCheckboxTree().then(checkParentNodesExpanded);
    }

}

export default new CheckBoxPage();