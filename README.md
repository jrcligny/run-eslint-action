# @jrcligny/run-eslint-action

An action to lint your JavaScript code with ESLint and provide annotations in the Pull Request to associate messages with a particular file in your repository.
A summary of the linted files that contain errors or warnings is also displayed in the GitHub Actions workflow.

## Inputs

- `pattern`: Specify the files to lint. This input is optional (default: `**/*.js`).
- `overrideConfigFile`: Specify the ESLint configuration file. This input is optional (default: none).

## Contribute

### Setup

```bash
npm install
```

### Visual Studio Code tasks

- `Run tests`: Run all tests and may generate coverage report
- `Run Current Spec File`: Run the current spec file
- `Run Related Spec File`: Run the spec file related to the current source file. The test suite description must match the source filename.
- `Open Coverage Report`: Open the coverage report in the default browser

### Visual Studio Code debugger

- `Debug Jest Tests`

### NPM scripts

- `test`: Run all tests and generate coverage report
- `lint`: Lint JavaScript files
- `package`: Package the project
- `all`: Run all tests, generate coverage report, lint files, and package the project.
