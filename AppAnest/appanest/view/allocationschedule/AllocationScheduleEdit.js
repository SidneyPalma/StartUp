//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleEdit', {
    extend: 'Ext.window.Window',

    xtype: 'allocationscheduleedit',

    requires: [
        'AppAnest.view.person.NaturalPersonSearch',
        'AppAnest.view.person.ContractorUnitSearch'
    ],

    controller: 'allocationschedule',

    title: 'Editar Plantao Agendado',

    width: 650,

    layout: {
        type: 'fit'
    },

    buttons: [
        {
            showSmartTheme: 'red-dark',
            text: 'Salvar',
            handler: 'updateAllocationSchedule'
        }, {
            text: 'Fechar',
            showSmartTheme: 'green',
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

    listeners: {
        show: 'onShowAllocationScheduleEdit'
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
                        name: 'releasetype'
                    }, {
                        anchor: '',
                        width: 150,
                        useMondaFont: true,
                        readOnlyColor: false,
                        fieldStyle: {
                            textAlign: 'center',
                            color: 'blue;',
                            fontSize: '20px;'
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
                            readOnlyColor: false,
                            fieldStyle: {
                                color: 'blue;',
                                fontSize: '16px;'
                            }
                        },
                        items: [
                            {
                                flex: 2,
                                pageSize: 0,
                                name:  'contractorunit',
                                fieldLabel: 'Unidade',
                                xtype: 'naturalpersonsearch',
                                store: 'AppAnest.store.person.ContractorUnit'
                            }, {
                                xtype: 'splitter'
                            }, {
                                width: 250,
                                pageSize: 0,
                                fieldLabel: 'SubUnidade',
                                submitValue: false,
                                hiddenNameId: 'subunit',
                                xtype: 'combosearch',
                                name: 'subunitdescription',
                                store: 'AppAnest.store.person.ContractorSubUnit',
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
                            readOnlyColor: false,
                            fieldStyle: {
                                color: 'blue;',
                                fontSize: '16px;'
                            }
                        },
                        items: [
                            {
                                flex: 1,
                                pageSize: 0,
                                allowBlank: false,
                                fieldLabel: 'Plantonista',
                                name: 'naturalperson',
                                xtype: 'naturalpersonsearch'
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
                                xtype: 'numberfield'
                            }
                        ]
                    }, {
                        useMondaFont: true,
                        fieldLabel: 'Observacao',
                        allowBlank: false,
                        xtype: 'textfield',
                        name: 'observation'
                    }, {
                        height: 180,
                        useMondaFont: true,
                        xtype: 'displayfield',
                        name: 'observationlog',
                        fieldLabel: 'Historico'
                    }
                ]
            }
        ]
    }
    
});