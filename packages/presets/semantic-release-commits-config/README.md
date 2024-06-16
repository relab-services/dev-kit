# @relab/semantic-release-commits-config

[**semantic-release**](https://github.com/semantic-release/semantic-release) shareable config defines standards for commit name conventions.

## Plugins

This shareable configuration use the following plugins:

-   [`@semantic-release/commit-analyzer`](https://github.com/semantic-release/commit-analyzer)
-   [`@semantic-release/release-notes-generator`](https://github.com/semantic-release/release-notes-generator)

## Install

```bash
$ npm install --save-dev semantic-release @relab/semantic-release-commits-config
```

## Usage

The shareable config can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

**package.json**:

```json
{
    "extends": "@relab/semantic-release-commits-config"
}
```

**.release.rc.js**:

```javascript
const common = require('@relab/semantic-release-commits-config')

module.exports = {
    ...common,
    plugins: [
        ...common.plugins,
        /* your plugins here */
    ],
}
```

## Configuration

See each [plugin](#plugins) documentation for required installation and configuration steps.
