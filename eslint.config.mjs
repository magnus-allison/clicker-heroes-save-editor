import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores([
		// Declaring `globalIgnores` drops eslint-config-next's defaults, so they
		// have to be restated here.
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		// Vendored agent/skill content.
		'.claude/**',
		'.agents/**'
	]),
	{
		rules: {
			// `import type` everywhere it applies, so type-only imports are erased
			// predictably.
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{ prefer: 'type-imports', fixStyle: 'separate-type-imports' }
			],
			// Allow deliberately unused bindings when prefixed with `_`.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'after-used',
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					ignoreRestSiblings: true
				}
			],
			// Correctness issues in this codebase, not style nits.
			eqeqeq: ['error', 'always', { null: 'ignore' }],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-var': 'error',
			'prefer-const': 'error',
			'object-shorthand': 'warn'
		}
	},
	{
		// Test files run under `node --test`, not in the browser.
		files: ['**/*.test.ts'],
		rules: {
			'no-console': 'off'
		}
	}
]);

export default eslintConfig;
