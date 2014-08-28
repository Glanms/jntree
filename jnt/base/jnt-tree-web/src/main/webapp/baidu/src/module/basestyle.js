KityMinder.registerModule('basestylemodule', function() {
    var km = this;

    function getNodeDataOrStyle(node, name) {
        return node.getData(name) || node.getStyle(name);
    }

    KityMinder.TextRenderer.registerStyleHook(function(node, text) {
        text.setFont({
            weight: getNodeDataOrStyle(node, 'font-weight'),
            style: getNodeDataOrStyle(node, 'font-style')
        });
    });
    return {
        'commands': {
            'bold': kity.createClass('boldCommand', {
                base: Command,

                execute: function(km) {

                    var nodes = km.getSelectedNodes();
                    if (this.queryState('bold') == 1) {
                        utils.each(nodes, function(i, n) {
                            n.setData('font-weight').render();
                        });
                    } else {
                        utils.each(nodes, function(i, n) {
                            n.setData('font-weight', 'bold').render();
                        });
                    }
                    km.layout();
                },
                queryState: function() {
                    var nodes = km.getSelectedNodes(),
                        result = 0;
                    if (nodes.length === 0) {
                        return -1;
                    }
                    utils.each(nodes, function(i, n) {
                        if (n && n.getData('font-weight')) {
                            result = 1;
                            return false;
                        }
                    });
                    return result;
                }
            }),
            'italic': kity.createClass('italicCommand', {
                base: Command,

                execute: function(km) {

                    var nodes = km.getSelectedNodes();
                    if (this.queryState('italic') == 1) {
                        utils.each(nodes, function(i, n) {
                            n.setData('font-style').render();
                        });
                    } else {
                        utils.each(nodes, function(i, n) {
                            n.setData('font-style', 'italic').render();
                        });
                    }

                    km.layout();
                },
                queryState: function() {
                    var nodes = km.getSelectedNodes(),
                        result = 0;
                    if (nodes.length === 0) {
                        return -1;
                    }
                    utils.each(nodes, function(i, n) {
                        if (n && n.getData('font-style')) {
                            result = 1;
                            return false;
                        }
                    });
                    return result;
                }
            })
        },
        addShortcutKeys: {
            'bold': 'ctrl+b', //bold
            'italic': 'ctrl+i' //italic
        }
    };
});