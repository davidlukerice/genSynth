module.exports = {
  dist: {
    options: {
      removeComments: true,
      collapseWhitespace: true
    },
    files: [{
      src: 'dist/public/index.html',
      dest: 'dist/public/index.html'
    }]
  }
};