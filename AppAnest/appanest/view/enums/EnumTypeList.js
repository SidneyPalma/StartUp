//@charset ISO-8859-1
Ext.define( 'AppAnest.view.enums.EnumTypeList', {
    extend: 'Ext.container.Container',

    xtype: 'enumtypelist',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.*',
        'Ext.button.Segmented',
        'Ext.layout.container.*',
        'AppAnest.store.enums.EnumType'
    ],

    controller: 'enumtype',

    padding: 10,

    layout: {
        type: 'fit'
    },

    listeners: {
        afterrender: 'onFocusSearch'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this,
            store = Ext.create('AppAnest.store.enums.EnumType');

        me.items = [
            {
                frame: true,
                xtype: 'panel',

                bodyStyle: 'padding: 30px 10px 10px 10px;',

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                header: {
                    title: 'Listar enumeradores',
                    items: [
                        {
                            xtype: 'button',
                            glyph: 0xeb4e,
                            handler: 'onHistoryBack'
                        }
                    ]
                },
                items: [
                    {
                        flex: 1,
                        xtype: 'container'
                    }, {
                        overflowY: 'auto',
                        width: 600,
                        xtype: 'panel',
                        layout: 'border',
                        items: [
                            {
                                bodyStyle: 'padding-bottom: 10px;',
                                layout: 'hbox',
                                region: 'north',
                                xtype: 'panel',
                                items: [
                                    {
                                        flex: 1,
                                        xtype: 'textfield',
                                        name: 'search',
                                        reference: 'search',
                                        hasSearch: true,
                                        listeners: {
                                            change: 'onSearchAlter'
                                        }
                                    }, {
                                        width: 5,
                                        xtype: 'splitter'
                                    }, {
                                        width: 70,
                                        xtype: 'segmentedbutton',
                                        defaults: {
                                            showSmartTheme: 'green'
                                        },
                                        items: [
                                            {
                                                disabled: true,
                                                glyph: 0xe875,
                                                text: 'Novo',
                                                handler: 'insertViewNew'
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                xtype: 'panel',
                                region: 'center',
                                layout: 'card',
                                bodyStyle: 'padding: 0 0 30px 0;',
                                reference: 'userViews',
                                dockedItems: [
                                    {
                                        xtype: 'pagingtoolbar',
                                        store: store,
                                        dock: 'bottom',
                                        displayInfo: true
                                    }
                                ],
                                items: [
                                    {
                                        xtype: 'gridpanel',
                                        store: store,
                                        listeners: {
                                            itemdblclick: 'onViewEdit'
                                        },
                                        columns: [
                                            {
                                                width: 30,
                                                text: 'Reservado',
                                                align: 'center',
                                                renderer: function (value, meta, rec) {
                                                    return rec.get('reserved') ? '<span style="color: #6E7B8B; width: 20px;"><i class="icon-lock"></i></span>' : '';
                                                }
                                            }, {
                                                text: 'Descrição',
                                                dataIndex: 'description',
                                                flex: 1
                                            }, {
                                                text: 'Nome',
                                                dataIndex: 'name',
                                                width: 200
                                            }, {
                                                header: 'Cadastro',
                                                width: 80,
                                                cls: 'smart-widgetcolumn',
                                                xtype: 'widgetcolumn',
                                                widget: {
                                                    width: 70,
                                                    xtype: 'button',
                                                    text: 'Editar',
                                                    glyph: 0xe85e,
                                                    showSmartTheme: 'red',
                                                    handler: 'onViewEdit'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }, {
                        flex: 1,
                        xtype: 'container'
                    }
                ]
            }
        ];
    }

});