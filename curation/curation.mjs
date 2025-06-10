import { validateTOC } from 'myst-toc';
import yaml from 'js-yaml';
import { resolveArticlesFromTOC } from 'myst-cli';

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
    run(data) {
        // Validate ToC
        let toc = "yay" ?? "oh no!";
        console.log(toc);
        let obj = yaml.load(data.body);
        console.log(obj);
        let opts = { property: "test" }; // I don't know what this does 😱
        // toc = validateTOC( [{ file: "foo.md" }], { property: "test" } );
        toc = validateTOC(obj, opts) ?? "oh no!";
        console.log(toc);
        return [{
            type: "block",
            children: [
                {
                    type: "heading",
                    depth: 2,
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
