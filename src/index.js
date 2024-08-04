import actionsCore from '@actions/core'
import fs from 'node:fs/promises'
import eslint from 'eslint'

import EslintFactory from './eslint-factory'
import EslintRunner from './eslint-runner'

const eslintFactoryInstance = new EslintFactory(actionsCore, fs, eslint)
const eslintRunnerInstance = new EslintRunner(actionsCore, eslintFactoryInstance)
eslintRunnerInstance.lint()
