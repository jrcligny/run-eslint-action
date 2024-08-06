const actionsCore = require('@actions/core')
const fs = require('node:fs/promises')
const eslint = require('eslint')

const EslintFactory = require('./eslint-factory')
const EslintRunner = require('./eslint-runner')

const eslintFactoryInstance = new EslintFactory(actionsCore, fs, eslint)
const eslintRunnerInstance = new EslintRunner(actionsCore, eslintFactoryInstance)
eslintRunnerInstance.lint()
