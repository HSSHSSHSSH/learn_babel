const CONSOLE_METHODS = ['log', 'info', 'error', 'debug'];
module.exports = function ({ types: t, template }) {
    return {
        visitor: {
            CallExpression: function (path, state) {
                // 跳过新插入的节点
                if (path.node._isNew) return;

                const callee = path.get('callee');

                // 判断是否是console方法调用
                if (callee.isMemberExpression() &&
                    callee.get('object').isIdentifier({ name: 'console' }) &&
                    callee.get('property').isIdentifier() &&
                    CONSOLE_METHODS.includes(callee.get('property').node.name)) {

                    const { line, column } = path.node.loc.start;

                    // 使用模板创建位置信息打印节点
                    const locationNode = template(`
                        console.LOG_TYPE(LOCATION);
                      `)({
                        LOG_TYPE: t.identifier('log'),
                        LOCATION: t.stringLiteral(`filename: (${line}, ${column})`)
                    });

                    locationNode.expression._isNew = true;

                    // 在console调用前插入位置信息
                    path.insertBefore(locationNode.expression);
                }
            }
        }
    }
}
