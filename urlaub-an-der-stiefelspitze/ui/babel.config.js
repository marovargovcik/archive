const presets = [
    [
        "@babel/preset-env",
        {
            useBuiltIns: "usage",
            targets: {
                ie: 11,
            },
        },
    ],
];

const plugins = [
    [
        "@babel/plugin-transform-runtime",
        {
            helpers: false,
        },
    ],
];

module.exports = { presets, plugins };
