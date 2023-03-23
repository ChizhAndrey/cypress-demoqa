export const checkParentNodesExpanded = ($elements: JQuery<HTMLElement>) => {
  $elements.each((i, el) => {
    const isParentNode = el.classList.contains("rct-node-parent")

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