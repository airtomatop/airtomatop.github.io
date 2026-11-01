import rehypeTypst from '@myriaddreamin/rehype-typst';

// rehype-typst 0.7.0 emits a global `svg { fill: none }` rule.
// Restrict that rule to Typst SVGs so other diagrams keep their own fill.
function scopeSvgRule(node, insideTypst = false) {
  const classes = node.properties?.className;

  const isTypstSvg = node.tagName === 'svg'
    && Array.isArray(classes)
    && classes.includes('typst-doc');

  if (isTypstSvg) {
    classes.push('typst-math');

    if (String(node.properties.style ?? '').includes('display: block')) {
      classes.push('typst-display');
      node.properties.style = '';
    }
  }

  const inTypst = insideTypst || isTypstSvg;

  if (inTypst && node.tagName === 'style') {
    for (const child of node.children ?? []) {
      if (child.type === 'text') {
        child.value = child.value.replace(/(^|})\s*svg\s*\{/g, '$1\nsvg.typst-doc {');
      }
    }
  }

  for (const child of node.children ?? []) {
    scopeSvgRule(child, inTypst);
  }
}

export default function rehypeTypstScoped(options) {
  const renderTypst = rehypeTypst(options);

  return async function (tree, file) {
    await renderTypst(tree, file);
    scopeSvgRule(tree);
  };
}