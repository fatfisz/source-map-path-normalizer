# source-map-path-normalizer

> Works on Windows too!

## The problem

Let's say you use [grunt-browserify](https://github.com/jmreidy/grunt-browserify) with a `debug` option turned on.
And you use a transform, e.g. [reactify](https://github.com/andreypopp/reactify).
And you work on Windows! (true story)

Then you open Chrome Dev Tools and instead of something like this:
```
localhost:8080
├─ js
|  ├─ dir1
|  |  ├─ script1.js
|  |  ├─ script2.js
|  ├─ dir2
|  |  ├─ script1.js
|  |  └─ script2.js
|  └─ bundle.js
└─ node-modules
   ├─ grunt-browserify/node_modules/browserify/node_modules
   │  ├─ browser-pack
   |  |  └─ _prelude.js
   |  └─ events
   |     └─ events.js
   ├─ module1
   └─ module2

```

you see this:

```
localhost:8080
└─ js
   ├─ node_modules
   |  ├─ grunt-browserify/node_modules/browserify/node_modules/events
   |  |  └─ events.js
   |  ├─ module1
   |  └─ module2
   ├─ D:\LongPathToTheProject\js\dir1\script1.js        The filename is a full absolute path.
   ├─ D:\LongPathToTheProject\js\dir1\script2.js        And where did my directory structure go?
   ├─ D:\LongPathToTheProject\js\dir2\script1.js        Oh no!
   ├─ D:\LongPathToTheProject\js\dir2\script2.js
   ├─ bundle.js
   └─ node_modules\grunt-browserify\node_modules\browserify\node_modules\browser-pack\_prelude.js
```

## The solution

You could configure source map options for each transform on your own or do some other time-consuming things.
And in the end you'll find out that not everything works on Windows, because no one bothers with different path separators.

But with this package you can write:

```js
var sourceMapPathNormalizer = require('source-map-path-normalizer');

function normalizePaths(err, src, next) {
  if (err) {
    return next(err);
  }

  var newSrc = sourceMapPathNormalizer(src);
  next(null, newSrc);
}
```

and in the configuration:

```js
    ...
    options: {
      browserifyOptions: { debug: true },
      postBundleCB: normalizePaths,
    },
    ...
```

This solved the problem for me!

## Usage

`require('source-map-path-normalizer')` returns a function that expects two arguments and returns a string.

The first one is the source of a bundle that you want to have processed.
The bundle should contain the whole source map (not a path) in the form of a comment.
The source can be of any type, as long as `source.toString()` will return the source in the form of a string.

The second one is an options object (described below).

The result, if correct arguments were passed, will be the source file with a normalized source map comment appended (the old comment will not be present). The type of the result is String.

### Options

#### options.root
Type: `String`
Default: `process.cwd()`

The path with respect to which we will be resolving the paths saved in the old source map.

E.g. for an old path `D:\LongPathToTheProject\js\dir2\script2.js` and `options.root` set to `D:\LongPathToTheProject`, the resulting path will be `js/dir2/script2.js` (notice the normalized separators).

#### options.sourceRoot
Type: `String`
Default: `'/'`

The new value of the `sourceRoot` source map property.

## "This almost solves my problem, but not exactly"

Create an issue, maybe together we can work something out.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## License
Copyright (c) 2015 FatFisz. Licensed under the MIT license.
