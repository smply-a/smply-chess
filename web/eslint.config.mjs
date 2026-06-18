import stylistic from "@stylistic/eslint-plugin";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
    // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),

    {
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "@stylistic/indent": [
                "error", 
                4, 
                { 
                    "SwitchCase": 1,         
                    "VariableDeclarator": 1,  
                    "outerIIFEBody": 1        
                }
            ]
        }
    }
]);

export default eslintConfig;
