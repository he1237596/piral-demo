const path = require('path');

module.exports = (config) => {
  if (config.module.rules.length && Array.isArray(config.module.rules[0].oneOf)) {
    config.module.rules[0].oneOf.unshift({
      test: /\.less$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: {
              mode: 'local',
              localIdentName: process.env.NODE_ENV === 'production' ? '[hash:base64]' : '[local]_[hash:base64:6]',
            },
          },
        },
        require.resolve('less-loader'),
      ],
    });
  }
  config.resolve.alias = {
    '@': path.resolve(__dirname, './src'),
  };
  return config;
};
