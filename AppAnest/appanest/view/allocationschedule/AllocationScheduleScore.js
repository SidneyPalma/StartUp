//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleScore', {
    extend: 'Ext.window.Window',

    xtype: 'allocationschedulescore',

    requires: [
        'AppAnest.view.person.NaturalPersonSearch',
        'AppAnest.view.person.ContractorUnitSearch'
    ],

    controller: 'allocationschedule',

    title: 'Lancar Contagem',

    width: 650,

    modal: true,

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
        show: 'onShowAllocationScheduleScore'
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
                                hiddenNameId: 'contractorunitid',
                                name:  'contractorunit',
                                fieldLabel: 'Unidade',
                                xtype: 'naturalpersonsearch',
                                store: 'AppAnest.store.person.ContractorUnit'
                            }, {
                                xtype: 'splitter'
                            }, {
                                xtype: 'fieldcontainer',
                                width: 250,
                                layout: 'hbox',
                                defaults: {
                                    hideTrigger: true,
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
                                        xtype: 'comboenum',
                                        fieldLabel: 'SubUnidade',
                                        name: 'subunitdescription'
                                    }, {
                                        xtype: 'splitter'
                                    }, {
                                        width: 90,
                                        minValue: 4,
                                        maxValue: 12,
                                        name: 'shifthours',
                                        fieldLabel: 'Horas/Plantao',
                                        xtype: 'numberfield'
                                    }
                                ]
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
                                hiddenNameId: 'naturalpersonid',
                                xtype: 'naturalpersonsearch'
                            }, {
                                xtype: 'splitter'
                            }, {
                                allowBlank: false,
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
                    }
                ]
            }
        ]
    }

});