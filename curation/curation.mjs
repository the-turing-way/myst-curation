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

    // Generate ToC
    let toc = {
      type: "List",
      ordered: ordered,
      start: ordered ? 1 : null,
      spread: false,
      children: [],
    };
    toc.children = process_toc_tree(items);

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

  // Get head and remainder of list
  let [head, ...tail] = toc_tree;

  let nodes = [];

  // Add current item to toc
  nodes.push(toc_item(head["item"]));

  // If this is the head of a new branch
  if ("children" in head) {
    // Process this branch and add it to the toc
    nodes.push(toc_branch(head["children"]));
  }

  // At end of a branch
  if (tail.length == 0) {
    // Return a list item and terminate recursion
    return nodes;
  }

  // Process the remainder
  return nodes.concat(process_toc_tree(tail));
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

// Return a list node for a branch of the ToC tree
function toc_branch(toc_tree) {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: process_toc_tree(toc_tree),
  };
}

const plugin = {
  name: "Curation",
  directives: [curationDirective],
};

export default plugin;
