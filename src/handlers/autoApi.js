const { transformFromAstSync } = require('@babel/core');
const  parser = require('@babel/parser');
const autoApiDocPlugin = require('../plugins/auto-api-doc');
const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, '../sourceCode/apiDemo.js'), {
    encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['typescript']
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[autoApiDocPlugin, {
        outputDir: path.resolve(__dirname, './docs'),
        format: 'markdown'// html / json
    }]]
});

// console.log(code);