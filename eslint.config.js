import { includeIgnoreFile } from '@eslint/compat';
import eslintjs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import * as path from 'path';
import typescriptEslint from 'typescript-eslint';

export default [
    includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore')),
    eslintjs.configs.recommended,
    ...typescriptEslint.configs.strictTypeChecked,
    ...typescriptEslint.configs.stylisticTypeChecked,
    prettier,
    { ignores: [path.basename(import.meta.filename)] },
    {
        languageOptions: {
            parserOptions: {
                sourceType: 'module',
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        }
    },
];