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
        cy.get(`#tree-node-${node}`).should('not.be.checked');
        cy.get(`label[for="tree-node-${node}"]`).click();

        return this;
    }

    uncheckNode(node: TreeNode) {
        cy.get(`#tree-node-${node}`).should('be.checked');
        cy.get(`label[for="tree-node-${node}"]`).click();

        return this;
    }

    private isParrentNode(node: TreeNode): Cypress.Chainable<boolean> {
        return cy.get(`#tree-node-${node}`)
            .parents('li')
            .first()
            .then(($li: JQuery<HTMLLIElement>) => {
                return $li.hasClass('rct-node-parent')
            });
    }

    private assertSvgParentNodeContainsClass($li: JQuery<HTMLLIElement>, expectedClass: string) {
        cy.wrap($li)
            .find('.rct-checkbox svg')
            .first()
            .should('contain.class', expectedClass);
    }

    private assertParentNodesVisualState(childNode: TreeNode, expectedClass: string) {
        
        cy.get(`#tree-node-${childNode}`)
            .parentsUntil('#tree-node', 'li.rct-node-parent')
            .each(($li: JQuery<HTMLLIElement>, i: number, collection: HTMLLIElement[]) => {
                // Если коллекция содержит только один элемент, значит проверяем корневой узел
                if(collection.length === 1) {
                    // Проверяем, является ли childNode родительским узлом.
                    // Если НЕ является — проверяем визуальное состояние родителя.
                    this.isParrentNode(childNode).then(isParent => {
                        if(!isParent) this.assertSvgParentNodeContainsClass($li, expectedClass);
                    });
                } else if(collection.length > 1 && i === 0) {
                    // Первый элемент в цепочке родителей может быть самим childNode,
                    // если он является родительским узлом. Пропускаем его.
                    this.isParrentNode(childNode).then(isParent => {
                        if(!isParent) this.assertSvgParentNodeContainsClass($li, expectedClass);
                    });
                } else {
                    this.assertSvgParentNodeContainsClass($li, expectedClass);
                }
            });
        
        return this;
    }

    private assertChildNodesChecked(parentNode: TreeNode) {
        cy.get(`#tree-node-${parentNode}`)
            .parents('li').first()
            .find('ol input[type="checkbox"]')
            .each(($input: JQuery<HTMLInputElement>) => {
                cy.wrap($input).should('be.checked');
            });
    }

    assertNodeIsChecked(node: TreeNode) {
        cy.get(`#tree-node-${node}`).should('be.checked');
        this.assertParentNodesVisualState(node, 'rct-icon-half-check');
        this.isParrentNode(node).then((isParent: boolean) => {
            if(isParent) this.assertChildNodesChecked(node);
        });

        return this;
    }

    assertNodeIsUnchecked(node: TreeNode) {
        cy.get(`#tree-node-${node}`).should('not.be.checked');
        this.assertParentNodesVisualState(node, 'rct-icon-uncheck');
        // Refinement required
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