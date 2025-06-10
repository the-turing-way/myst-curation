import { validateTOC } from 'myst-toc';
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
    },
    run(data, vfile, ctx) {
        // Process options
        const depth = data.options?.depth ?? 2;
        const description = data.options?.description ?? null;
        // let description = "hello";

        // Validate ToC
        let obj = yaml.load(data.body);
        let opts = { property: "test" }; // I don't know what this does 😱
        let toc = validateTOC(obj, opts) ?? "oh no!";
        console.log(toc);

        // Process ToC
        toc = ctx.parseMyst(data.body);
        console.log(toc);

        let items = [];

        // Add heading
        items.push({
            type: "heading",
            depth: depth,
            enumerated: false,
            children: [
                { type: "text", value: data.arg },
            ],
        });

        // Add desscription
        if (description) {
            items.push({
                type: "paragraph",
                children: [
                    // { type: "text", value: description },
                    ctx.parseMyst(description).children[0]
                ],
            })
        };

        // Add Toc
        items.push(toc.children[0])

        return [{type: "block", children: items}];
    },
};

const plugin = {
    name: "Curation",
    directives: [curationDirective],
};

export default plugin;
