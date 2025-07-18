
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
