reprod
=====

Quickly create reproduction examples of third party code

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/reprod.svg)](https://npmjs.org/package/reprod)
[![Downloads/week](https://img.shields.io/npm/dw/reprod.svg)](https://npmjs.org/package/reprod)
[![License](https://img.shields.io/npm/l/reprod.svg)](https://github.com/aequasi/reprod/blob/master/package.json)

# Usage
```sh-session
$ npm i -g reprod
$ reprod -n zeit/swr@0.1.16

  ✔ Preparing Dependencies
  ✔ Creating Files

Finished creating reproduction!

$ cd swr-repro-<tab>
...
```

# Library Owner Usage

Create a `.reprod.js` file in the root directory of the project.

Build it to match the code below:

```typescript jsx
interface File {
    path: string;
    content?: string;
    url?: string;
    localUrl?: string;
    permissions?: number;
}

interface Config {
  package: {
    [key: string]: any;
  };
  files: File[];
}

type ConfigFn = (config: {version: string; repo: string}) => Config;
```

```javascript
const pkg = require('./package.json');
module.exports = ({version, repo}) => {
    return {
        package: { // This whole object gets thrown into a `package.json` file
            dependencies: {
                [pkg.name]: version,
                // Any other dependencies here
            }
        },
        files: [
            {
                path: 'index.ts',
                content: `import Library from '${pkg.name}';

Library.doSomethingAwesomeThatBreaks();
`
            }
        ]
    }
}
```

You can test this by running `reprod` in the library directory.

Check out [this library's `.reprod.js`](https://github.com/aequasi/reprod/blob/master/.reprod.js) for an example.
