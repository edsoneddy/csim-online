import globals from "globals";

export default [
  {
    ignores: ["dist/", "node_modules/", "vite.config.js"]
  },
  {
    files: ["**/*.{js,jsx}"],
    
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true 
        }
      }
    },
    
    rules: {
      'no-unused-vars': ['warn', { 
        'vars': 'all', 
        'args': 'after-used', 
        'ignoreRestSiblings': true 
      }]
    }
  }
];
