//@charset ISO-8859-1
Ext.define( 'AppAnest.view.contract.ContractNew', {
    extend: 'Ext.window.Window',

    xtype: 'contractnew',

    requires: [
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'AppAnest.store.person.*',
        'AppAnest.store.contract.*'
    ],

    controller: 'contract',

    title: 'Novo Contrato',

    modal: true,
    autoShow: true,

    layout: {
        type: 'fit'
    },

    width: 450,

    defaultFocus : 'contractnumber',

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
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        flex: 1,
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
                                itemId: 'contractnumber',
                                fieldLabel: 'Contrato n.o',
                                xtype: 'textfield',
                                name: 'contractnumber',
                                plugins: 'textmask',
                                mask: '999/9999'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                xtype: 'datefield',
                                plugins: 'textmask',
                                fieldLabel: 'Contrato data',
                                name: 'contractdate'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                allowBlank: true,
                                readOnlyColor: true,
                                xtype: 'textfield',
                                plugins: 'textmask',
                                fieldLabel: 'Aditivo n.o',
                                name: 'additivenumber',
                                mask: '000',
                                value: 0
                            }
                        ]
                    }, {
                        fieldLabel: 'Celebrado entre as partes',
                        labelStyle: 'color: blue; font-size: 14px;',
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        defaults: {
                            pageSize: 0,
                            allowBlank: false
                        },
                        items: [
                            {
                                anchor: '100%',
                                submitValue: false,
                                fieldLabel: 'Empresa Contratada',
                                xtype: 'combosearch',
                                store: 'AppAnest.store.person.LegalEntity',
                                displayField: 'shortname',
                                hiddenNameId: 'legalentityid'
                            }, {
                                anchor: '100%',
                                submitValue: false,
                                fieldLabel: 'Mantenedora',
                                xtype: 'combosearch',
                                store: 'AppAnest.store.person.Contractor',
                                displayField: 'shortname',
                                hiddenNameId: 'contractorid'
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
                        fieldLabel: 'Descrição',
                        xtype: 'textfield',
                        name: 'description'
                    }, {
                        fieldLabel: 'Arquivo',
                        xtype: 'filefield',
                        name: 'filedata',
                        tableName: 'contract',
                        accept: 'application/pdf',
                        buttonText: Ext.emptyText,
                        buttonConfig: {
                            width: 34,
                            minWidth: 34,
                            glyph: 0xeef8,
                            showSmartTheme: 'green'
                        }
                    }, {
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
            handler: 'updateContractNew'
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