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
    },
    run(data, vfile, ctx) {
        // Process options
        const depth = data.options?.depth ?? 2;
        const description = data.options?.description ?? null;
        const label = data.options?.label ?? null;

        // Process ToC
        // let obj = yaml.load(data.body);
        let toc = ctx.parseMyst(data.body);
        console.log(toc);

        let items = [];

        // Add label
        if (label) {
            items.push({
                type: "mystTarget",
                label: label,
            });
        }

        // Add heading
        items.push({
            type: "heading",
            depth: depth,
            enumerated: false,
            children: [
                { type: "text", value: data.arg },
            ],
        });

        // Add description
        if (description) {
            items.push({
                type: "paragraph",
                children: [
                    ctx.parseMyst(description).children[0]
                ],
            })
        };

        // Add ToC
        items.push(toc.children[0])

        return items;
    },
};

const plugin = {
    name: "Curation",
    directives: [curationDirective],
};

export default plugin;
