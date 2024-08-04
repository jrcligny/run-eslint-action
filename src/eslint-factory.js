module.exports = class EslintFactory
{
	/**
	 * @param {import('@actions/core')} actionsCore
	 * @param {import('node:fs/promises')} fs
	 * @param {import('eslint')} eslint
	 */
	constructor(actionsCore, fs, eslint)
	{
		/** @type {import('@actions/core')} */
		this.actionsCore = actionsCore
		/** @type {import('node:fs/promises')} */
		this.fs = fs
		/** @type {import('eslint')} */
		this.eslint = eslint
	}

	/**
	 * 
	 * @returns {Promise<import('eslint').ESLint>}
	 */
	async create()
	{
		const overrideConfigFile = this.actionsCore.getInput('overrideConfigFile') || undefined
		if (overrideConfigFile && !(await this.fs.stat(overrideConfigFile)))
		{
			throw new Error(`'${overrideConfigFile}' does not exist. Action cannot continue.`)
		}

		const ESLint = await this.eslint.loadESLint({ useFlatConfig: true })
		this.actionsCore.info(`ESLint loaded with ${JSON.stringify({ useFlatConfig: true, overrideConfigFile })}`)
		return new ESLint({ overrideConfigFile })
	}
}
