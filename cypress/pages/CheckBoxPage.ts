import { checkParentNodesExpanded } from '../support/utility/utilityFuncs';

const treeNodeList = [
    'home', 'desctop', 'notes', 'commands',
    'documents', 'workspace', 'react', 'angular',
    'veu', 'office', 'public', 'private',
    'classfied', 'general', 'downloads', 'wordFile',
    'excelFile'
] as const;

type TreeNode = typeof treeNodeList[number];

class CheckBoxPage {
    elements = {
        checkBoxTree: () => cy.get('#tree-node'),
        expandButton: () => cy.get('button[title="Expand all"]'),
        collapseButton: () => cy.get('button[title="Collapse all"]'),
        setOfListItems: () => cy.get('#tree-node ol li'),
        result: () => cy.get('#result .text-success'),
    }

    visit() {
        cy.visit('/checkbox');
        this.elements.checkBoxTree().should('be.visible');

        return this;
    }

    expandAllNodes() {
        this.elements.expandButton().click();
        return this;
    }

    collapseAllNodes() {
        this.elements.collapseButton().click();
        return this;
    }

    checkNode(node: TreeNode) {
        cy.get(`label[for="tree-node-${node}"] .rct-checkbox`).click();
        return this;
    }

    assertParentNodesVisualState(childNode: TreeNode, expectedClass: string) {
        cy.get(`#tree-node-${childNode}`)
            .parentsUntil('#tree-node', 'li.rct-node-parent')
            .each((li: HTMLLIElement) => {
                cy.wrap(li).find('.rct-checkbox svg').first()
                    .should('contain.class', expectedClass);
            });
        
        return this;
    }

    assertNodeIsChecked(node: TreeNode) {
        cy.get(`#tree-node-${node}`).should('be.checked');
        this.assertParentNodesVisualState(node, 'rct-icon-half-check');

        return this;
    }

    assertParentNodesExpanded() {
        this.elements.setOfListItems().then(checkParentNodesExpanded);
        return this;
    }

    assertParentNodesCollapsed() {
        checkBoxPage.elements.setOfListItems()
            .should('contain.class', 'rct-node-collapsed')
            .and('have.length', 1);

        return this;
    }

    verifyResultContains(values: TreeNode[]) {
        this.elements.result()
            .should('have.length', values.length)
            .and(result => {
                values.forEach(val => {
                    expect(result, `Expected result text to contain "${val}"`).to.contain.text(val);
                });
            });
        
        return this;
    }
}

const checkBoxPage = new CheckBoxPage();

export { checkBoxPage };