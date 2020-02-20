module.exports = {
    extends: "airbnb-base",
    rules: {
        indent: ["warn", 4, { SwitchCase: 1 }],
        // "indent-legacy": "error", // replace this with your previous `indent` configuration,
        "max-len": ["warn", { code: 180 }],
        "no-use-before-define": 0,
        "arrow-parens": 0,
        quotes: 0,
        "comma-dangle": 0,
        "linebreak-style": 0,
        "object-curly-spacing": 0,
        "no-param-reassign": 0,
        "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    },
};
