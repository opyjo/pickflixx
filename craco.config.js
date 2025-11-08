module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for Radix UI and React 17 JSX runtime issue
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
      return webpackConfig;
    },
  },
};


