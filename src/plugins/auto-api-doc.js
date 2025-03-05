const { declare } = require('@babel/helper-plugin-utils');
const doctrine = require('doctrine');
const fse = require('fs-extra');
const path = require('path');
const md = require('../utils/md');

const autoDocumentPlugin = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        pre(file) {
            file.set('docs', []);
        },
        visitor: {
            FunctionDeclaration(path, state) {
                const docs = state.file.get('docs');
                docs.push({
                    type: 'function',
                    name: path.get('id').toString(),
                    params: path.get('params').map(paramPath=> {
                        return {
                            name: paramPath.toString(),
                            type: resolveType(paramPath.getTypeAnnotation())
                        }
                    }),
                    return: resolveType(path.get('returnType').getTypeAnnotation()),
                    doc: path.node.leadingComments && parseComment(path.node.leadingComments[0].value)
                });
                state.file.set('docs', docs);
            },
            ClassDeclaration (path, state) {
                const docs = state.file.get('docs');
                const classInfo = {
                    type: 'class',
                    name: path.get('id').toString(),
                    constructorInfo: {},
                    methodsInfo: [],
                    propertiesInfo: [],
                    doc: path.node.leadingComments && parseComment(path.node.leadingComments[0].value)
                };
                
                path.traverse({
                    ClassProperty(path) {
                        classInfo.propertiesInfo.push({
                            name: path.get('key').toString(),
                            type: resolveType(path.getTypeAnnotation()),
                            doc: [path.node.leadingComments, path.node.trailingComments].filter(Boolean).map(comment => parseComment(comment.value)).filter(Boolean)
                        });
                    },
                    ClassMethod(path) {
                        console.log(path.node);
                        if(path.node.kind === 'constructor') {
                            classInfo.constructorInfo = {
                                params: path.get('params').map(paramPath => {
                                    return {
                                        name: paramPath.toString(),
                                        type: resolveType(paramPath.getTypeAnnotation()),
                                        doc: path.node.leadingComments && path.node.leadingComments.length > 0 ? 
                                             parseComment(path.node.leadingComments[0].value) : undefined
                                    }
                                })
                            }
                        } else {
                            classInfo.methodsInfo.push({
                                name: path.get('key').toString(),
                                doc: path.node.leadingComments && path.node.leadingComments.length > 0 ? 
                                     parseComment(path.node.leadingComments[0].value) : undefined,
                                params: path.get('params').map(paramPath => {
                                    return {
                                        name: paramPath.toString(),
                                        type: resolveType(paramPath.getTypeAnnotation())
                                    }
                                }),
                                return: resolveType(path.getTypeAnnotation())
                            })
                        }
                    }
                });
                docs.push(classInfo);
                state.file.set('docs', docs);
            }
         },
         post(file) {
            const docs = file.get('docs');
            console.log('生成的文档数据:', JSON.stringify(docs, null, 2));
            const res = generate(docs, options.format);
            try {
                fse.ensureDirSync(options.outputDir);
                const outputPath = path.join(options.outputDir, 'api-doc' + res.ext);
                fse.writeFileSync(outputPath, res.content);
                console.log('文档已生成至:', outputPath);
            } catch(err) {
                console.error('文档生成失败:', err);
            }
        }
    }
});

function parseComment(commentStr) {
    if (!commentStr) {
        return undefined;
    }
    return doctrine.parse(commentStr, {
        unwrap: true
    });
}

function resolveType(tsType) {
    const typeAnnotation = tsType.typeAnnotation;
    if (!typeAnnotation) {
        return;
    }
    switch (typeAnnotation.type) {
        case 'TSStringKeyword': 
            return 'string';
        case 'TSNumberKeyword':
            return 'number';
        case 'TSBooleanKeyword':
            return 'boolean';
    }
    
}


function generate(docs, format = 'json') {
    return {
        ext: '.md',
        content: md(docs)
    }
}

module.exports = autoDocumentPlugin;