import jest from "eslint-plugin-jest"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import globals from "globals"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

export default [...compat.extends("eslint:recommended", "plugin:jest/recommended"), {
	ignores: [
		"node_modules/*",
		"coverage/*",
		"dist/*",
	],
},{
	plugins: {
		jest,
	},

	languageOptions: {
		globals: {
			...globals.commonjs,
			...globals.jest,
			...globals.node,
		},

		ecmaVersion: 2023,
		sourceType: "module",
	},

	rules: {
		"i18n-text/no-en": "off",
		"import/no-commonjs": "off",
		"import/no-namespace": "off",
		"prettier/prettier": "off",
		semi: ["error", "never"],
		indent: ["error", "tab"],
		"filenames/match-regex": "off",
	},
}]