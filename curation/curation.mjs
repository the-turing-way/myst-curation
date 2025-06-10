import { validateTOC } from 'myst-toc';
import yaml from 'js-yaml';

const curationDirective = {
    name: "curation",
    doc: "curation",
    arg: {
        type: String,
        doc: "arg",
    },
    body: {
        type: String,
        doc: "body",
        required: true,
    },
    options: {
        depth: {
            type: Number,
            doc: "heading depth"
        },
    },
    run(data, vfile, ctx) {
        // Validate ToC
        let obj = yaml.load(data.body);
        let opts = { property: "test" }; // I don't know what this does 😱
        let toc = validateTOC(obj, opts) ?? "oh no!";
        console.log(toc);
        // Process options
        const depth = data.options?.depth ?? 2;
        return [{
            type: "block",
            children: [
                {
                    type: "heading",
                    depth: depth,
                    enumerated: false,
                    children: [
                        { type: "text", value: data.arg },
                    ],
                },
                {
                    type: "paragraph",
                    children: [
                        { type: "text", value: data.body },
                    ],
                },
            ]
        }];
    },
};

const plugin = {
    name: "Curation",
    directives: [curationDirective],
};

export default plugin;
