const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const hoistVariables = require('@babel/helper-hoist-variables').default;
const t = require('@babel/types');
const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, './sourceCode/varHoist.js'), 'utf-8');

const ast = parser.parse(code, {
    sourceType: 'unambiguous'
});

traverse(ast, {
    FunctionDeclaration(path) {
        // 首先将 let 转换为 var
        path.traverse({
            VariableDeclaration(varPath) {
                if (varPath.node.kind === 'let') {
                    varPath.node.kind = 'var';
                }
            }
        });

        // 打印提升前的作用域信息
        console.log('Before hoisting:', {
            scope: Object.keys(path.scope.bindings),
            body: path.node.body.body.length
        });

        // 应用变量提升
        hoistVariables(path.scope, path, 'var');

        // 打印提升后的作用域信息
        console.log('After hoisting:', {
            scope: Object.keys(path.scope.bindings),
            body: path.node.body.body.length
        });
    }
});

const output = generate(ast, {}, code);
console.log('Transformed code:');
console.log(output.code);