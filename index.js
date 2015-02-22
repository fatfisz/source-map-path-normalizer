'use strict';

var path = require('path');

var convertSourceMap = require('convert-source-map');


module.exports = function (src, options) {
  var srcString = src.toString(); // src could be a buffer

  var sourceMap = convertSourceMap.fromSource(srcString);

  sourceMap.setProperty('sources',
    sourceMap.getProperty('sources').map(function (source) {
      // The path will be relative to the __dirname.
      // Also, replace "\" with "/" on Windows.
      return path.relative(options.root, source).replace(/\\/g, '/');
    })
  );

  sourceMap.setProperty('sourceRoot', options.sourceRoot || '/');

  return convertSourceMap.removeComments(srcString) + // Remove old source map
         sourceMap.toComment(); // Add the new one
};
