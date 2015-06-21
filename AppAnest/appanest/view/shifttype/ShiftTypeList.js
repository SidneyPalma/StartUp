//@charset ISO-8859-1
Ext.define( 'AppAnest.view.shifttype.ShiftTypeList', {
    extend: 'Ext.container.Container',

    xtype: 'shifttypelist',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.*',
        'AppAnest.store.shifttype.ShiftType'
    ],

    controller: 'shifttype',

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
            store = Ext.create('AppAnest.store.shifttype.ShiftType');

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
                    title: 'Listar plantões',
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
                                                text: 'Turno',
                                                dataIndex: 'shiftdescription',
                                                flex: 1,
                                                renderer: function (value, meta, rec) {
                                                    var validityof = rec.get('validityof'),
                                                        validityto = rec.get('validityto');
                                                    return '('+ validityof.substr(0, 5) +' - '+ validityto.substr(0, 5) +') ' + value;
                                                }
                                            }, {
                                                text: 'Tipo',
                                                dataIndex: 'dutytypedescription',
                                                width: 200,
                                                renderer: function (value, meta, rec) {
                                                    var hours = rec.get('hours');
                                                    return value +' '+ hours +'hs';
                                                }
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