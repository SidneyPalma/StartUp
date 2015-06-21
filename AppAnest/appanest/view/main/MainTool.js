//@charset ISO-8859-1
Ext.define( 'AppAnest.view.main.MainTool', {
    extend: 'Ext.panel.Panel',

    xtype: 'maintool',

    controller: 'main',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Smart.plugins.TreeFilter'
    ],

    layout: 'border',

    bodyCls: 'appanest-dashboard',

    hidden: true,

    initComponent: function () {
        var me = this;

        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                region: 'north',
                height: 50,
                bodyPadding: 10,
                layout: 'fit',
                cls: 'appanest-tool-panel',
                items: [
                    {
                        height: 30,
                        xtype: 'textfield',
                        cls: 'search',
                        emptyText: 'Filtrar',
                        showSmartBorder: true,
                        listeners: {
                            change: function (field, newValue, oldValue, eOpts) {
                                var tree = field.up('maintool').down('treepanel');
                                tree.filter(newValue);
                            }
                        }
                    }
                ]
            }, {
                region: 'center',
                xtype: 'treepanel',
                name: 'moduletask',
                cls: 'appanest-tool-panel',
                useArrows: true,
                singleExpand: true,
                plugins: [
                    {
                        ptype: 'treefilter',
                        allowParentFolders: true
                    }
                ],
                columns: [
                    {
                        xtype: 'treecolumn',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'text',
                        renderer: function (value, metaData, record) {
                            metaData.style = 'line-height: 21px;';
                            return Ext.String.format('<i class="{0} size-medium"></i>',record.get('glyph')) + value;
                        }
                    }
                ]
            }
        ]
    }

});