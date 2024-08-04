/// <reference types="@jest/globals" />
const EslintRunner = require('./eslint-runner.js')

describe('eslint-runner', () =>
{
	//#region helpers
	const actionsCoreMocked = {
		getInput: jest.fn(),
		error: jest.fn(),
		setFailed: jest.fn(),
		warning: jest.fn(),
		info: jest.fn(),
		summary: {
			addHeading: jest.fn(),
			addEOL: jest.fn(),
			addRaw: jest.fn(),
			write: jest.fn(),
		}
	}

	const eslintFactoryMocked = {
		create: jest.fn(),
	}

	function instantiate()
	{
		return new EslintRunner(actionsCoreMocked, eslintFactoryMocked)
	}
	//#endregion helpers

	beforeEach(() =>
	{
		jest.resetAllMocks()
	})

	describe('use pattern input', () =>
	{
		it('should use the pattern input if provided', async () =>
		{
			// Arrange
			actionsCoreMocked.getInput.mockImplementation((param) =>
			{
				if (param === 'pattern') return './src/**/*.js'
				return undefined
			})

			const eslintInstance = {
				lintFiles: jest.fn().mockResolvedValue([]),
			}
			eslintFactoryMocked.create.mockResolvedValue(eslintInstance)

			// Act
			const instance = instantiate()
			await instance.lint()

			// Assert
			expect(actionsCoreMocked.getInput).toHaveBeenCalledWith('pattern')
			expect(eslintInstance.lintFiles).toHaveBeenCalledWith(['./src/**/*.js'])
		})

		it('should use the default pattern if pattern input is not provided', async () =>
		{
			// Arrange
			actionsCoreMocked.getInput.mockImplementation(() => undefined)

			const eslintInstance = {
				lintFiles: jest.fn().mockResolvedValue([]),
			}
			eslintFactoryMocked.create.mockResolvedValue(eslintInstance)

			// Act
			const instance = instantiate()
			await instance.lint()

			// Assert
			expect(actionsCoreMocked.getInput).toHaveBeenCalledWith('pattern')
			expect(eslintInstance.lintFiles).toHaveBeenCalledWith(['**/*.js'])
		})
	})

	it('should log an error if severity is 2', async () =>
	{
		// Arrange
		const linResults = [{
			filePath: 'd:/path/to/file.js',
			messages: [{
				ruleId: 'no-unused-vars',
				severity: 2,
				message: 'Variable is not used',
				line: 5,
				endLine: 5,
				column: 10,
				endColumn: 15,
			}],
		}]
		eslintFactoryMocked.create.mockResolvedValue({
			lintFiles: jest.fn().mockResolvedValueOnce(linResults),
		})

		// Act
		const instance = instantiate()
		await instance.lint()

		// Assert
		expect(actionsCoreMocked.error).toHaveBeenCalledWith('no-unused-vars: Variable is not used', {
			file: 'd:/path/to/file.js',
			startLine: 5,
			endLine: 5,
			startColumn: 10,
			endColumn: 15,
		})
		expect(actionsCoreMocked.warning).not.toHaveBeenCalled()
		expect(actionsCoreMocked.summary.addRaw).toHaveBeenCalledWith('❌ d:/path/to/file.js', true)
		expect(actionsCoreMocked.summary.addRaw).not.toHaveBeenCalledWith('JavaScript linting passed with success', true)
		expect(actionsCoreMocked.summary.write).toHaveBeenCalledTimes(1)
		expect(actionsCoreMocked.setFailed).toHaveBeenCalledWith('JavaScript linting failed with errors')
	})

	it('should log a warning if severity is not 2', async () =>
	{
		// Arrange
		const linResults = [{
			filePath: 'd:/path/to/file.js',
			messages: [{
				ruleId: 'no-unused-vars',
				severity: 1,
				message: 'Variable is not used',
				line: 5,
				endLine: 5,
				column: 10,
				endColumn: 15,
			}],
		}]
		eslintFactoryMocked.create.mockResolvedValue({
			lintFiles: jest.fn().mockResolvedValueOnce(linResults),
		})

		// Act
		const instance = instantiate()
		await instance.lint()

		// Assert
		expect(actionsCoreMocked.error).not.toHaveBeenCalled()
		expect(actionsCoreMocked.warning).toHaveBeenCalledWith('no-unused-vars: Variable is not used', {
			file: 'd:/path/to/file.js',
			startLine: 5,
			endLine: 5,
			startColumn: 10,
			endColumn: 15,
		})
		expect(actionsCoreMocked.summary.addRaw).toHaveBeenCalledWith('⚠️ d:/path/to/file.js', true)
		expect(actionsCoreMocked.summary.addRaw).not.toHaveBeenCalledWith('JavaScript linting passed with success', true)
		expect(actionsCoreMocked.summary.write).toHaveBeenCalledTimes(1)
		expect(actionsCoreMocked.setFailed).not.toHaveBeenCalled()
	})

	it('should display success message if no errors or warnings', async () =>
	{
		// Arrange
		const linResults = [{
			filePath: 'd:/path/to/file.js',
			messages: [],
		}]
		eslintFactoryMocked.create.mockResolvedValue({
			lintFiles: jest.fn().mockResolvedValueOnce(linResults),
		})

		// Act
		const instance = instantiate()
		await instance.lint()

		// Assert
		expect(actionsCoreMocked.error).not.toHaveBeenCalled()
		expect(actionsCoreMocked.warning).not.toHaveBeenCalled()
		expect(actionsCoreMocked.summary.addRaw).toHaveBeenCalledWith('JavaScript linting passed with success', true)
		expect(actionsCoreMocked.summary.write).toHaveBeenCalledTimes(1)
		expect(actionsCoreMocked.setFailed).not.toHaveBeenCalled()
	})
})