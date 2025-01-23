const { transformFileSync } = require('@babel/core');
const logLocationPlugin = require('./plugins/log-location-plugin');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './sourceCode/log.js'), {
    plugins: [logLocationPlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']       
    }
});

console.log(code);