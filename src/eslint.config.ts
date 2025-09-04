import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

// Define constants for shared configurations
const filePatterns = ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"];
const globalOptions = { globals: globals.browser };

// Export the ESLint configuration
export default defineConfig([
	{
		files: filePatterns,
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: globalOptions,
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
]);
