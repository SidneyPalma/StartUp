//@charset ISO-8859-1
Ext.define( 'AppAnest.view.enums.EnumTypeView', {
    extend: 'Ext.container.Container',

    xtype: 'enumtypeview',

    requires: [
        'Ext.tab.*',
        'Ext.grid.Panel',
        'Ext.grid.column.*',
        'Ext.grid.plugin.RowEditing',
        'Smart.form.field.ComboEnum',
        'AppAnest.store.enums.EnumType',
        'AppAnest.store.enums.EnumTypeList'
    ],

    controller: 'enumtype',

    padding: 10,

    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this,
            storeEnumTypeList = Ext.create('AppAnest.store.enums.EnumTypeList');

        me.items = [
            {
                frame: true,
                xtype: 'panel',

                bodyStyle: 'padding: 30px 10px 10px 10px;',

                iconCls: 'icon-hospital',

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                header: {
                    title: 'Cadastro de Enumeradores',
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
                        xtype: 'container',
                        cls: 'smart-theme wallpaper'
                    }, {
                        width: 600,
                        xtype: 'form',
                        layout: 'border',
                        items: [
                            {
                                region: 'center',
                                xtype: 'container',
                                layout: 'border',
                                items: [
                                    {
                                        height: 230,
                                        region: 'north',
                                        layout: 'anchor',
                                        xtype: 'panel',
                                        defaults: {
                                            anchor: '100%',
                                            useMondaFont: true
                                        },
                                        items: [
                                            {
                                                xtype: 'label',
                                                text: 'Enumerador',
                                                style: {
                                                    color: 'blue;',
                                                    fontSize: '14px;'
                                                }
                                            }, {
                                                xtype: 'hiddenfield',
                                                name: 'id'
                                            }, {
                                                xtype: 'displayfield',
                                                fieldLabel: 'Nome',
                                                name: 'name',
                                                fieldStyle: {
                                                    color: '#C02942;',
                                                    fontSize: '18px;'
                                                }
                                            }, {
                                                xtype: 'displayfield',
                                                fieldLabel: 'Descrição',
                                                name: 'description',
                                                fieldStyle: {
                                                    color: '#C02942;',
                                                    fontSize: '18px;'
                                                }
                                            }, {
                                                xtype: 'textareafield',
                                                fieldLabel: 'Observações',
                                                name: 'observation',
                                                fieldStyle: {
                                                    'color': '#C02942;',
                                                    'fontSize': '14px;'
                                                }
                                            }
                                        ]
                                    }, {
                                        region: 'center',
                                        overflowY: 'auto',
                                        glyph: 0xe9eb,
                                        title: 'Enumeradores',
                                        xtype: 'container',
                                        layout: 'border',
                                        items: [
                                            {
                                                region: 'north',
                                                xtype: 'panel',
                                                bodyStyle: 'padding-top: 10px',
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        text: 'Listagem de Enumeradores',
                                                        style: {
                                                            color: 'blue;',
                                                            fontSize: '14px;'
                                                        }
                                                    }
                                                ]
                                            }, {
                                                overflowY: 'auto',
                                                region: 'west',
                                                xtype: 'form',
                                                layout: 'anchor',
                                                width: 200,
                                                reference: 'enumListForm',
                                                bodyStyle: 'padding: 10px 40px 10px 0',
                                                defaultType: 'textfield',
                                                items: [
                                                    {
                                                        name: 'id',
                                                        xtype: 'hiddenfield'
                                                    }, {
                                                        name: 'enumtypeid',
                                                        xtype: 'hiddenfield'
                                                    }, {
                                                        anchor: '50%',
                                                        fieldLabel: 'Código',
                                                        name: 'code'
                                                    }, {
                                                        anchor: '100%',
                                                        fieldLabel: 'Descrição',
                                                        name: 'description'
                                                    }, {
                                                        height: 130,
                                                        anchor: '100%',
                                                        xtype: 'textareafield',
                                                        fieldLabel: 'Observação',
                                                        name: 'observation'
                                                    }, {
                                                        anchor: '100%',
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        defaultType: 'button',
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                glyph: 0xe86c,
                                                                text: 'Salvar',
                                                                showSmartTheme: 'red',
                                                                handler: 'updateEnumList'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                glyph: 0xe875,
                                                                text: 'Novo',
                                                                showSmartTheme: 'red',
                                                                handler: 'insertEnumList'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {
                                                region: 'center',
                                                hideHeaders: false,
                                                xtype: 'gridpanel',
                                                store: storeEnumTypeList,
                                                columns: [
                                                    {
                                                        text: 'Código',
                                                        dataIndex: 'code',
                                                        width: 60,
                                                        editor: {
                                                            xtype: 'textfield',
                                                            allowBlank: false
                                                        }
                                                    }, {
                                                        text: 'Descrição',
                                                        dataIndex: 'description',
                                                        flex: 1,
                                                        editor: {
                                                            xtype: 'textfield',
                                                            allowBlank: false
                                                        }
                                                    }
                                                ],
                                                dockedItems: [
                                                    {
                                                        xtype: 'pagingtoolbar',
                                                        store: storeEnumTypeList,
                                                        dock: 'bottom',
                                                        displayInfo: false
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                region: 'south',
                                xtype: 'panel',
                                buttonAlign: 'center',
                                style: {
                                    borderTop: 'solid 1px #cecece'
                                },
                                buttons: [
                                    {
                                        glyph: 0xe86c,
                                        text: 'Salvar',
                                        showSmartTheme: 'red',
                                        handler: 'updateView'
                                    }, {
                                        glyph: 0xe869,
                                        text: 'Voltar',
                                        showSmartTheme: 'green',
                                        handler: 'onHistoryBack'
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
        ]

    }

});