//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleEdit', {
    extend: 'Ext.window.Window',

    xtype: 'allocationscheduleedit',

    requires: [
    ],

    controller: 'allocationschedule',

    title: 'Editar Plantao Agendado',

    width: 650,

    layout: {
        type: 'fit'
    },

    buttons: [
        {
            text: 'Salvar'
            //handler: 'showReportDirectorShip'
        }, {
            text: 'Fechar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ],

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
                        width: 100,
                        useMondaFont: true,
                        readOnlyColor: true,
                        fieldStyle: {
                            color: 'blue;',
                            fontSize: '16px;'
                        },
                        fieldLabel: 'Data',
                        xtype: 'datefield',
                        plugins: 'textmask',
                        name: 'dutydate'
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            useMondaFont: true,
                            readOnlyColor: true,
                            fieldStyle: {
                                color: 'blue;',
                                fontSize: '16px;'
                            }
                        },
                        items: [
                            {
                                flex: 2,
                                name:  'contractorunit',
                                fieldLabel: 'Unidade',
                                xtype: 'textfield'
                            }, {
                                xtype: 'splitter'
                            }, {
                                width: 250,
                                pageSize: 0,
                                fieldLabel: 'SubUnidade',
                                submitValue: false,
                                hiddenNameId: 'subunit',
                                xtype: 'combosearch',
                                store: 'AppAnest.store.person.ContractorSubUnit',
                                valueField: 'subunitdescription',
                                displayField: 'subunitdescription'
                            }, {
                                xtype: 'splitter'
                            }, {
                                width: 90,
                                xtype: 'comboenum',
                                fieldLabel: 'Turno',
                                name: 'shiftdescription'
                            }
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaults: {
                            useMondaFont: true,
                            readOnlyColor: true,
                            fieldStyle: {
                                color: 'blue;',
                                fontSize: '16px;'
                            }
                        },
                        items: [
                            {
                                flex: 1,
                                fieldLabel: 'Plantonista',
                                xtype: 'textfield'
                            }, {
                                xtype: 'splitter'
                            }, {
                                width: 250,
                                fieldLabel: 'Atribuicao',
                                xtype: 'comboenum',
                                name: 'allocationschemadescription'
                            }, {
                                xtype: 'splitter'
                            }, {
                                width: 90,
                                name: 'position',
                                fieldLabel: 'Posicao',
                                xtype: 'textfield'
                            }
                        ]
                    }, {
                        xtype: 'textareafield',
                        fieldLabel: 'Observacoes'
                    }
                ]
            }
        ]
    }
    
});