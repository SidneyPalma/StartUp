//@charset ISO-8859-1
Ext.define( 'AppAnest.view.shifttype.ShiftTypeView', {
    extend: 'Ext.container.Container',

    xtype: 'shifttypeview',

    requires: [
        'Smart.form.field.*',
        'Ext.form.RadioGroup'
    ],

    controller: 'shifttype',

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
        var me = this;

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
                    title: 'Cadastro do Turno',
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
                        layout: 'anchor',
                        defaults: {
                            anchor: '30%'
                        },
                        items: [
                            {
                                xtype: 'hiddenfield',
                                name: 'id'
                            }, {
                                xtype      : 'fieldcontainer',
                                fieldLabel : 'Plantão',
                                defaultType: 'radiofield',
                                defaults: {
                                    flex: 1
                                },
                                layout: 'hbox',
                                items: [
                                    {
                                        checked   : true,
                                        boxLabel  : 'Integral',
                                        name      : 'dutytype',
                                        inputValue: 'I'
                                    }, {
                                        boxLabel  : 'Fração',
                                        name      : 'dutytype',
                                        inputValue: 'F'
                                    }
                                ]
                            }, {
                                xtype: 'numberfield',
                                name: 'hours',
                                readOnlyColor: false,
                                fieldLabel: 'Horas',
                                maxValue: 12,
                                minValue: 1
                            }, {
                                xtype: 'comboenum',
                                fieldLabel: 'Turno',
                                name: 'shiftdescription'
                            }, {
                                fieldLabel: 'Per&#237odo',
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [
                                    {
                                        flex: 1,
                                        xtype: 'smarttimefield',
                                        name: 'validityof',
                                        fieldLabel: 'de'
                                    }, {
                                        xtype: 'splitter'
                                    }, {
                                        flex: 1,
                                        xtype: 'smarttimefield',
                                        name: 'validityto',
                                        fieldLabel: 'até'
                                    }
                                ]
                            }, {
                                anchor: '100%',
                                useMondaFont: true,
                                xtype: 'textareafield',
                                fieldLabel: 'Observações',
                                name: 'observation',
                                fieldStyle: {
                                    'color': '#C02942;',
                                    'fontSize': '14px;'
                                }
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                glyph: 0xe86c,
                                text: 'Salvar',
                                showSmartTheme: 'red',
                                handler: 'updateView'
                            }, {
                                glyph: 0xe875,
                                text: 'Novo',
                                showSmartTheme: 'red',
                                handler: 'insertView'
                            }, {
                                glyph: 0xe869,
                                text: 'Voltar',
                                showSmartTheme: 'green',
                                handler: 'onHistoryBack'
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