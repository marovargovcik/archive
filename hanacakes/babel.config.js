module.exports = {
  exclude: /node_modules/,
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          ie: 11
        }
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime']
};
