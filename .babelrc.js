module.exports = (api) => {
    api.cache(true);
    const presets = [
        // '@babel/preset-typescript',
        [
            '@babel/preset-env', {
                "useBuiltIns": "usage",
                "targets": {
                    "chrome": "49",
                    "ie": "11"
                },
                "corejs": 3
            }
        ],
        '@babel/preset-react',
    ]
    const plugins = [
        ['@babel/plugin-transform-runtime', {
            corejs: 3,
        }],
    ]
    return {
        // sourceType: 'unambiguous',
        presets,
        plugins,
    }
}