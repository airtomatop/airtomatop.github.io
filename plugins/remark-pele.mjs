import { render } from 'pele';

export default function remarkPele() {
  return function (tree) {
    let diagramIndex = 0;

    function walk(parent) {
      for (const [index, node] of (parent.children ?? []).entries()) {
        if (node.type === 'code' && node.lang === 'mermaid') {
          const { svg } = render(node.value, {
            idPrefix: `pele-${diagramIndex++}`,
            fontFamily: '"American Typewriter", serif',
          });

          parent.children[index] = {
            type: 'html',
            value: `<div class="diagram">${svg}</div>`,
          };
        } else {
          walk(node);
        }
      }
    }

    walk(tree);
  };
}