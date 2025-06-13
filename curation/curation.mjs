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
    toc.children = process_toc_tree(items);
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

  console.log("tree:\n", toc_tree);

  // At end of a branch
  // Get head and remainder of list
  let [head, ...tail] = toc_tree;
  console.log("head:\n", head);
  console.log("tail:\n", tail);

  let nodes = [];
  // console.log("Adding item to list");
  nodes.push(toc_item(head["item"]));
  // console.log("nodes:\n", nodes);

  if ("children" in head) {
    // console.log("Processing children");
    // console.log("children:\n", head["children"]);
    nodes.push(toc_branch(head["children"]));
    // console.log("nodes:\n", nodes);
  }

  if (tail.length == 0) {
    // Return a list item and terminate recursion
    // console.log("last item");
    return nodes;
  }

  // Process the remainder
  return nodes.concat(process_toc_tree(tail));
}

// Return a single list item node for a ToC entry
function toc_item(target) {
  console.log(target);
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
