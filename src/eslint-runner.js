export default class EslintRunner
{
	/**
	 * @param {import('@actions/core')} actionsCore
	 * @param {import('./eslint-factory')} eslintFactory
	 */
	constructor(actionsCore, eslintFactory)
	{
		/** @type {import('@actions/core')} */
		this.actionsCore = actionsCore
		/** @type {import('./eslint-factory')} */
		this.eslintFactory = eslintFactory
	}

	async lint()
	{
		const eslintInstance = await this.eslintFactory.create()

		const pattern = this.actionsCore.getInput('pattern') || '**/*.js'
		const lintResults = await eslintInstance.lintFiles([pattern])
	
		this.actionsCore.info(`Lint files matching with '${pattern}'`)

		let hasErrors = false
		/** @type Summary */
		const summary = []
		for (const lintResult of lintResults)
		{
			const { filePath, messages: lintMessages } = lintResult
	
			const summaryItem = {
				filePath,
				errorCount: 0,
				warningCount: 0,
			}
			summary.push(summaryItem)

			for (const lintMessage of lintMessages)
			{
				const { ruleId, severity, message, line, endLine, column, endColumn, } = lintMessage

				const issueMessage = `${ruleId}: ${message}`
				const annotationProperties = {
					file: filePath,
					startLine: line,
					endLine,
					startColumn: column,
					endColumn,
				}

				if (severity === 2) {
					hasErrors = true
					this.actionsCore.error(issueMessage, annotationProperties)
					summaryItem.errorCount++
				} else {
					this.actionsCore.warning(issueMessage, annotationProperties)
					summaryItem.warningCount++
				}
			}
		}
		
		if (hasErrors)
		{
			this.actionsCore.setFailed('JavaScript linting failed with errors')
		}

		await this.writeSummary(summary)
	}

	/**
	 * @private
	 * @param {Summary} summary Summary to display
	 */
	async writeSummary(summary)
	{
		this.actionsCore.summary.addHeading('JavaScript Linting Results')
		this.actionsCore.summary.addEOL()
		let hasErrors = false
		let hasWarnings = false
		for (const summaryItem of summary)
		{
			if (summaryItem.errorCount > 0)
			{
				hasErrors = true
				this.actionsCore.summary.addRaw(`❌ ${summaryItem.filePath}`, true)
			}
			else if (summaryItem.warningCount > 0)
			{
				hasWarnings = true
				this.actionsCore.summary.addRaw(`⚠️ ${summaryItem.filePath}`, true)
			}
		}

		if (!hasErrors && !hasWarnings)
		{
			this.actionsCore.summary.addRaw('JavaScript linting passed with success', true)
		}

		await this.actionsCore.summary.write()
	}
}

/**
 * @typedef {Array<SummaryEntry>} Summary
 */

/**
 * @typedef {Object} SummaryEntry
 * @property {string} filePath
 * @property {number} errorCount
 * @property {number} warningCount
 */