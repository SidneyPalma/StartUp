//@charset ISO-8859-1
Ext.define( 'AppAnest.view.contract.ContractAdditiveNew', {
    extend: 'Ext.window.Window',

    xtype: 'contractadditivenew',

    requires: [
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'AppAnest.store.person.*',
        'AppAnest.store.contract.*'
    ],

    controller: 'contract',

    title: 'Novo Aditivo',

    modal: true,
    glyph: 0xe859,

    layout: {
        type: 'fit'
    },

    width: 450,

    defaultFocus : 'additivenumber',

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                padding: 10,
                xtype: 'form',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'contractid'
                    }, {
                        flex: 1,
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        fieldLabel: 'Estrutura',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            allowBlank: false
                        },
                        items: [
                            {
                                flex: 1,
                                xtype: 'textfield',
                                fieldLabel: 'Contrato n.o',
                                name: 'contractnumber',
                                readOnlyColor: true,
                                plugins: 'textmask',
                                mask: '999/9999'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'datefield',
                                fieldLabel: 'Contrato data',
                                name: 'contractdate',
                                readOnlyColor: true,
                                plugins: 'textmask'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'textfield',
                                plugins: 'textmask',
                                fieldLabel: 'Aditivo n.o',
                                name: 'additivenumber',
                                itemId: 'additivenumber',
                                mask: '999'
                            }
                        ]
                    }, {
                        fieldLabel: 'Celebrado entre as partes',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        defaultType: 'textfield',
                        items: [
                            {
                                anchor: '100%',
                                name: 'legalentity',
                                readOnlyColor: true,
                                fieldLabel: 'Empresa Contratada'
                            }, {
                                anchor: '100%',
                                name: 'contractor',
                                readOnlyColor: true,
                                fieldLabel: 'Mantenedora'
                            }
                        ]
                    }, {
                        fieldLabel: 'Vigência',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            allowBlank: false
                        },
                        items: [
                            {
                                flex: 1,
                                fieldLabel: 'De',
                                xtype: 'datefield',
                                plugins: 'textmask',
                                name: 'periodof'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                fieldLabel: 'Até',
                                xtype: 'datefield',
                                plugins: 'textmask',
                                name: 'periodto'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'datefield',
                                plugins: 'textmask',
                                fieldLabel: 'Assinou em',
                                name: 'datesign'
                            }
                        ]
                    }, {
                        allowBlank: false,
                        fieldLabel: 'Descrição',
                        xtype: 'textfield',
                        name: 'description'
                    }, {
                        fieldLabel: 'Arquivo',
                        xtype: 'filefield',
                        name: 'filedata',
                        tableName: 'additive',
                        accept: 'application/pdf',
                        buttonText: Ext.emptyText,
                        buttonConfig: {
                            width: 34,
                            minWidth: 34,
                            glyph: 0xeef8,
                            showSmartTheme: 'green'
                        }
                    }, {
                        allowBlank: false,
                        fieldLabel: 'Nota',
                        xtype: 'textareafield',
                        name: 'note'
                    }
                ]
            }
        ]
    },

    buttonAlign: 'center',

    buttons: [
        {
            glyph: 0xe86c,
            showSmartTheme: 'red',
            text: 'Confirmar',
            handler: 'updateAdditiveNew'
        }, {
            glyph: 0xe83f,
            showSmartTheme: 'red',
            text: 'Cancelar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ]

});