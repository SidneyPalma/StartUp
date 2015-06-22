//@charset ISO-8859-1
Ext.define( 'AppAnest.view.contract.ContractList', {
    extend: 'Ext.container.Container',

    xtype: 'contractlist',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.*',
        'AppAnest.view.contract.*',
        'AppAnest.store.contract.*'
    ],

    controller: 'contract',

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
            store = Ext.create('AppAnest.store.contract.Contract');

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
                    title: 'Listar Contratos/Aditivos',
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
                                                handler: 'onContractNew'
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                xtype: 'panel',
                                region: 'center',
                                layout: 'card',
                                bodyStyle: 'padding: 0 0 30px 0;',
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
                                        cls: 'contract-list',
                                        reference: 'contractList',
                                        columns: [
                                            {
                                                dataIndex: 'contractnumber',
                                                width: 150,
                                                renderer: function (value, meta, rec) {
                                                    meta.style ='line-height: 45px; text-align: center; font-family: Monda; height: 100%; ' +
                                                                'color: #0000cc; font-size: 32px;' + ( rec.get('isactive') == true ? 'background: #faf2f2;' : 'background: #E8DDCB;');
                                                    return Smart.maskRenderer('999/9999', false)(value);
                                                }
                                            }, {
                                                dataIndex: 'additivelist',
                                                width: 160,
                                                renderer: function (value, meta, rec) {
                                                    var me = this;
                                                    meta.style =  rec.get('isactive') == true ? 'background: #faf2f2;' : 'background: #E8DDCB;';

                                                    Ext.additiveitem = function (id) {
                                                        me.fireEvent('additiveitem', me, id);
                                                    };

                                                    return Ext.String.format('<div style="height: 45px; width: 100%;" class="data">{0}</div>',value);
                                                }
                                            }, {
                                                flex: 1,
                                                renderer: function (value, meta, rec) {
                                                    var legalentity = rec.get('legalentity'),
                                                        contractor = rec.get('contractor'),
                                                        cnpjnumber = Smart.maskRenderer('99.999.999/9999-99', false)(rec.get('cnpjnumber')),
                                                        html =  '<div class="line">' +
                                                                    '<div style="width:100%;" class="data">' + contractor + '<br/>' + cnpjnumber + '<br/>' + legalentity + '</div>' +
                                                                '</div>';

                                                    meta.style = rec.get('isactive') == true ? 'background: #faf2f2;' : 'background: #E8DDCB;';

                                                    return html;
                                                }
                                            }, {
                                                width: 80,
                                                dataIndex: 'periodto',
                                                renderer: function (value, meta, rec) {
                                                    var html =  '<div class="line">' +
                                                                    '<div style="width:100%;" class="data">Expira em:<br/> <b>' + Ext.util.Format.date(Ext.Date.parse(value,"Y-m-d"),'d/m/Y') + '</b></div>' +
                                                                '</div>';

                                                    meta.style = rec.get('isactive') == true ? 'background: #faf2f2;' : 'background: #E8DDCB;';

                                                    return html;
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