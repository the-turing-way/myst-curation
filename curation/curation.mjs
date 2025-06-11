import yaml from 'js-yaml';

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
        for (const item of items) {
            console.log(item)
            toc.children.push(
                toc_item(item)
            );
        }
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
            children: [
                { type: "text", value: data.arg },
            ],
        });

        // Add description
        if (description) {
            nodes.push({
                type: "paragraph",
                children: [
                    ctx.parseMyst(description).children[0]
                ],
            })
        };

        // Add ToC
        nodes.push(toc)

        return nodes;
    },
};

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
        ]
    }
}

const plugin = {
    name: "Curation",
    directives: [curationDirective],
};

export default plugin;
