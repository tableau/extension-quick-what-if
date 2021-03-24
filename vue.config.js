module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  pages: {
    index: {
      entry: 'src/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Quick What-If',
    },
    config: {
      entry: 'src/config.js',
      template: 'public/config.html',
      filename: 'config.html',
      title: 'Configure',
    },
    popup: {
      entry: 'src/popup.js',
      template: 'public/popup.html',
      filename: 'popup.html',
      title: 'Input PopUp',
    },
  },
};
