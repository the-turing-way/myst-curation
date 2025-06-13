import yaml from "js-yaml";

const curationDirective = {
  name: "curation",
  doc: "curation",
  arg: {
    type: String,
    doc: "Curation title",
  },
  body: {
    type: String,
    doc: "body",
    required: true,
  },
  options: {
    depth: {
      type: Number,
      doc: "Heading depth",
    },
    description: {
      type: String,
      doc: "Curation description",
    },
    label: {
      type: String,
      doc: "Target label for this curation",
    },
    ordered: {
      type: Boolean,
      doc: "If true curation is an ordered list",
    },
  },
  run(data, vfile, ctx) {
    // Process options
    const depth = data.options?.depth ?? 2;
    const description = data.options?.description ?? null;
    const label = data.options?.label ?? null;
    const ordered = data.options?.ordered ?? false;

    // Parse body
    let items = yaml.load(data.body);
    console.log(items);

    // Generate ToC
    let toc = {
      type: "List",
      ordered: ordered,
      start: ordered ? 1 : null,
      spread: false,
      children: [],
    };
    toc.children = process_toc_tree(items)
    console.log(toc);

    // List of AST nodes
    let nodes = [];

    // Add label
    if (label) {
      nodes.push({
        type: "mystTarget",
        label: label,
      });
    }

    // Add heading
    nodes.push({
      type: "heading",
      depth: depth,
      enumerated: false,
      children: [{ type: "text", value: data.arg }],
    });

    // Add description
    if (description) {
      nodes.push({
        type: "paragraph",
        children: [ctx.parseMyst(description).children[0]],
      });
    }

    // Add ToC
    nodes.push(toc);

    return nodes;
  },
};

// Process the ToC tree and return the children of a list node
function process_toc_tree(toc_tree) {
  // Takes a nested yaml list like
  // - a
  // - b  <-- Head of new branch
  // - - c
  // - - d
  // - e

  // At end of a branch
  if (toc_tree.length == 1) {
    // Return a list item and terminate recursion
    return [toc_item(toc_tree[0])];
  }

  // Get first, second and remainder of list
  let [head, next, ...tail] = toc_tree;

  if (Array.isArray(next)) {
    // This is the head of a new branch
    return toc_branch(head, next).concat(
      process_toc_tree(tail)
    );
  } else {
    // This is an item in the list
    return [toc_item(head)].concat(
      process_toc_tree([next].concat(tail))
    );
  }
}

// Return a single list item node for a ToC entry
function toc_item(target) {
  return {
    type: "listItem",
    spread: true,
    children: [
      {
        type: "link",
        url: target,
        children: [],
      },
    ],
  };
}

// Return a list item and list node for a branch of the ToC tree
function toc_branch(target, children) {
  return [
    {
      type: "listItem",
      spread: true,
      children: [
        {
          type: "link",
          url: target,
          children: [],
        },
      ],
    },
    {
      type: "list",
      ordered: false,
      spread: false,
      children: process_toc_tree(children),
    }
  ];
}

const plugin = {
  name: "Curation",
  directives: [curationDirective],
};

export default plugin;
