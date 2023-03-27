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

export const checkTableRowsForSubstring = ($rows: JQuery<HTMLElement>, searchWord: string) => {
  //String.prototype.includes() чувствителен к регистру.
  //Можно обойти это ограничение, преобразовав как исходную строку, так и строку поиска в нижний регистр.
  searchWord = searchWord.toLocaleLowerCase();

  $rows.each((i, row) => {
      //Если строка пустая - пропускаем
      if(!row.classList.contains("-padRow")) {
          //Создаем из строки массив значений ячеек
          const rowArray = Array.from(row.children).map(cell => cell.textContent);

          let stringThatContainsSubstring: string;
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