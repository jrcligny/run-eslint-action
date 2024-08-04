/// <reference types="@jest/globals" />
const EslintFactory = require('./eslint-factory.js')

describe('eslint-factory', () =>
{
	//#region helpers
	const actionsCoreMocked = {
		getInput: jest.fn(),
		info: jest.fn(),
	}

	const fsMocked = {
		stat: jest.fn(),
	}

	const eslintMocked = {
		loadESLint: jest.fn(),
	}

	function instantiate()
	{
		return new EslintFactory(actionsCoreMocked, fsMocked, eslintMocked)
	}
	//#endregion helpers

	beforeEach(() =>
	{
		jest.resetAllMocks()
	})

	it('should return a new instance of ESLint if overrideConfigFile is provided', async () =>
	{
		// Arrange
		actionsCoreMocked.getInput.mockImplementation((param) =>
		{
			if (param === 'overrideConfigFile') return './path/to/.eslintrc.json'
			return undefined
		})

		fsMocked.stat.mockResolvedValueOnce(true)

		const ESLint = jest.fn().mockReturnValue({})
		eslintMocked.loadESLint.mockResolvedValue(ESLint)

		// Act
		const instance = instantiate()
		await instance.create()

		// Assert
		expect(actionsCoreMocked.getInput).toHaveBeenCalledWith('overrideConfigFile')
		expect(fsMocked.stat).toHaveBeenCalledWith('./path/to/.eslintrc.json')
		expect(eslintMocked.loadESLint).toHaveBeenCalledWith({ useFlatConfig: true })
		expect(ESLint).toHaveBeenCalledWith({ overrideConfigFile: './path/to/.eslintrc.json' })
	})

	it('should return a new instance of ESLint if overrideConfigFile is not provided', async () =>
	{
		// Arrange
		actionsCoreMocked.getInput.mockImplementation((param) =>
		{
			if (param === 'overrideConfigFile') return ''
			return undefined
		})

		fsMocked.stat.mockResolvedValueOnce(true)

		const ESLint = jest.fn().mockReturnValue({})
		eslintMocked.loadESLint.mockResolvedValue(ESLint)

		// Act
		const instance = instantiate()
		await instance.create()

		// Assert
		expect(actionsCoreMocked.getInput).toHaveBeenCalledWith('overrideConfigFile')
		expect(fsMocked.stat).not.toHaveBeenCalled()
		expect(eslintMocked.loadESLint).toHaveBeenCalledWith({ useFlatConfig: true })
		expect(ESLint).toHaveBeenCalledWith({ overrideConfigFile: undefined })
	})

	it('should throw an error if overrideConfigFile does not exist', async () =>
	{
		// Arrange
		actionsCoreMocked.getInput.mockImplementation((param) =>
		{
			if (param === 'overrideConfigFile') return './path/to/.eslintrc.json'
			return undefined
		})

		fsMocked.stat.mockResolvedValueOnce(false)

		// Act & Assert
		const instance = instantiate()
		await expect(instance.create()).rejects.toThrow(`'./path/to/.eslintrc.json' does not exist. Action cannot continue.`)

		expect(actionsCoreMocked.getInput).toHaveBeenCalledWith('overrideConfigFile')
		expect(fsMocked.stat).toHaveBeenCalledWith('./path/to/.eslintrc.json')
	})
})