# @jrcligny/run-eslint-action

An action to lint your JavaScript code with ESLint (9.10.0) and provide annotations in the Pull Request to associate messages with a particular file in your repository.
A summary of the linted files that contain errors or warnings is also displayed in the Workflows.

Only [flat configuration files](https://eslint.org/docs/latest/use/configure/migration-guide#start-using-flat-config-files) are supported.

## Inputs

- `pattern`: Specify the files to lint. This input is optional (default: `**/*.js`).
- `overrideConfigFile`: Specify the ESLint configuration file. This input is optional (default: `none`).
	If not provided, it tries to find the default [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file).

## Usage

```yaml annotate
name: Continuous Integration

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  lint-javascript:
    name: Lint JavaScript Codebase
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        id: checkout
        uses: actions/checkout@v4

      - name: Lint Codebase
        uses: jrcligny/run-eslint-action@v1
        with:
          # Specify the files to lint. This input is optional (default: `**/*.js`)
          pattern: 'src/**/*.js'
          # Specify the ESLint configuration file. This input is optional (default: none)
          overrideConfigFile: src/eslint.config.js
```
