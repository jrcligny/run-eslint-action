# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-08-04

### Added

- Input `pattern` to specify the files to lint. This input is optional (default: `**/*.js`).
- Input `overrideConfigFile` to specify the ESLint configuration file. This input is optional (default: none).
- List linted files that contain errors or warnings in the summary of the GitHub Actions workflow.
- Display ESLint errors and warnings as annotations in the Pull Request to associate messages with a particular file in your repository.


[unreleased]: https://github.com/jrcligny/run-eslint-action/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/jrcligny/run-eslint-action/releases/tag/v1.0.0