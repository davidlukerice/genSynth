/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

/*
var compileCompass = require('broccoli-compass'),
    pickFiles = require('broccoli-static-compiler'),
    mergeTrees = require('broccoli-merge-trees');

app.styles = function() {
  var addonTrees = this.addonTreesFor('styles');
  var vendor = this._processedVendorTree();
  var styles = pickFiles(this.trees.styles, {
    srcDir: '/',
    destDir: '/app/styles'
  });

  var trees = [vendor];
  trees.concat(addonTrees);
  trees.push(styles);
  var stylesAndVendor = mergeTrees(trees, {
    description: 'TreeMerger (stylesAndVendor)'
  });

  //var stylesAndVendor = mergeTrees([vendor, styles, 'public']);

  return compileCompass(stylesAndVendor, 'app' + '/styles/gen-synth.scss', {
    outputStyle: 'expanded',
    require: 'sass-css-importer',
    sassDir: 'app' + '/styles',
    imagesDir: 'images',
    fontsDir: 'fonts',
    cssDir: '/assets'
  });
};

*/




// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('vendor/bootstrap/dist/css/bootstrap.min.css');
app.import('vendor/asNEAT-visualizer/dist/asNEAT-visualizer.css');

app.import('vendor/WebMIDIAPIShim/WebMIDIAPI.js');
app.import({
  development: 'vendor/jquery/dist/jquery.js',
  production: 'vendor/jquery/dist/jquery.min.js'
});
app.import({
  development: 'vendor/bootstrap/dist/js/bootstrap.js',
  production: 'vendor/bootstrap/dist/js/bootstrap.min.js'
});
app.import({
  development: 'vendor/lodash/dist/lodash.js',
  production: 'vendor/lodash/dist/lodash.min.js'
});
app.import({
  development: 'vendor/d3/d3.js',
  production: 'vendor/d3/d3.min.js'
});
app.import({
  development: 'vendor/chroma-js/chroma.js',
  production: 'vendor/chroma-js/chroma.min.js'
});
app.import({
  development: 'vendor/asNEAT/dist/asNEAT.js',
  production: 'vendor/asNEAT/dist/asNEAT.min.js'
});
app.import({
  development: 'vendor/asNEAT-visualizer/dist/asNEAT-visualizer.js',
  production: 'vendor/asNEAT-visualizer/dist/asNEAT-visualizer.min.js'
});

module.exports = app.toTree();
