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
        //    showSmartTheme: 'red-dark',
        //    text: 'Salvar',
        //    handler: 'updateAllocationSchedule'
        //}, {
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
                                        pageSize: 0,
                                        xtype: 'combobox',
                                        editable: false,
                                        hideTrigger: false,
                                        valueField: 'shifthours',
                                        displayField: 'shifthoursdescription',
                                        name: 'shifthours',
                                        fieldLabel: 'Horas/Plantao',
                                        store: {
                                            fields: ['shifthours', 'shifthoursdescription'],
                                            data: [
                                                { shifthours: 4, shifthoursdescription: '4 hs' },
                                                { shifthours: 6, shifthoursdescription: '6 hs' },
                                                { shifthours: 8, shifthoursdescription: '8 hs' },
                                                { shifthours: 12, shifthoursdescription: '12 hs' }
                                            ]
                                        },
                                        listeners: {
                                            select: 'onSelectShiftHours'
                                        }
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
                    }, {
                        height: 250,
                        xtype: 'tabpanel',
                        name: 'navigation-items',
                        ui: 'navigation-items',
                        tabBar: {
                            layout: {
                                pack: 'center'
                            }
                        },
                        items: [
                            {
                                glyph: 0xe953,
                                title: 'Realizado por',
                                xtype: 'container',
                                name: 'containersubmit',
                                layout: 'border',
                                items: [
                                    {
                                        width: 300,
                                        region: 'west',
                                        xtype: 'gridpanel',
                                        columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                            meta.style = "font-size: 20px; line-height: 17px; font-family: Monda; color: rgba(252, 24, 36,.6);";
                                            return value;
                                        },
                                        name: 'schedulingmonthlyscoreR',
                                        store: Ext.create('AppAnest.store.allocationschedule.SchedulingMonthlyScore'),
                                        columns: [
                                            {
                                                text: 'Plantonista',
                                                dataIndex: 'naturalperson',
                                                flex: 1
                                            }, {
                                                align: 'center',
                                                width:50,
                                                dataIndex: '',
                                                renderer: function (value, meta, rec) {
                                                    return '<div class="delete-item" style="color: rgba(252, 24, 36,1); font-size: 18px;"><i class="icon-cancel-circle"></i></div>';
                                                }
                                            }
                                        ],
                                        listeners: {
                                            select: 'onSelectScoreR',
                                            cellclick: 'onCellClickScore'
                                        }
                                    }, {
                                        region: 'center',
                                        xtype: 'form',
                                        name: 'schedulingmonthlyscoreR',
                                        bodyStyle: 'padding: 10px 0 0 20px',
                                        layout: 'anchor',
                                        defaults: {
                                            allowBlank: false,
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                allowBlank: true,
                                                xtype: 'hiddenfield',
                                                name: 'id'
                                            }, {
                                                xtype: 'hiddenfield',
                                                name: 'scoretype',
                                                value: 'R'
                                            }, {
                                                xtype: 'hiddenfield',
                                                name: 'schedulingmonthlypartnersid'
                                            }, {
                                                pageSize: 0,
                                                fieldLabel: 'Socio',
                                                name: 'naturalperson',
                                                hiddenNameId: 'naturalpersonid',
                                                xtype: 'naturalpersonsearch'
                                            }, {
                                                fieldLabel: 'Observacoes',
                                                name: 'observation',
                                                xtype: 'textareafield'
                                            }, {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        name: 'username'
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        xtype: 'displayfield',
                                                        name: 'changedate'
                                                    }
                                                ]
                                            }, {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        flex: 1
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        flex: 1,
                                                        text: 'Novo',
                                                        xtype: 'button',
                                                        showSmartTheme: 'red-dark',
                                                        handler: 'onInsertScore'
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        flex: 1,
                                                        text: 'Salvar',
                                                        xtype: 'button',
                                                        showSmartTheme: 'red-dark',
                                                        handler: 'onUpdateScore'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                glyph: 0xee03,
                                title: 'Pagar para',
                                xtype: 'container',
                                name: 'containersubmit',
                                layout: 'border',
                                items: [
                                    {
                                        width: 300,
                                        region: 'west',
                                        xtype: 'gridpanel',
                                        columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                            meta.style = "font-size: 20px; line-height: 17px; font-family: Monda; color: rgba(3, 98, 253, 1);";
                                            return ( colIndex == 1 ) ? Smart.maskRenderer('0,00',true)(value) : value;
                                        },
                                        name: 'schedulingmonthlyscoreP',
                                        store: Ext.create('AppAnest.store.allocationschedule.SchedulingMonthlyScore'),
                                        columns: [
                                            {
                                                text: 'Plantonista',
                                                dataIndex: 'naturalperson',
                                                flex: 1
                                            }, {
                                                align: 'right',
                                                text: 'Plantao',
                                                dataIndex: 'dutyfraction',
                                                width: 70
                                            }, {
                                                align: 'center',
                                                width:50,
                                                dataIndex: '',
                                                renderer: function (value, meta, rec) {
                                                    return '<div class="delete-item" style="color: rgba(3, 98, 253, 1); font-size: 18px;"><i class="icon-cancel-circle"></i></div>';
                                                }
                                            }
                                        ],
                                        listeners: {
                                            select: 'onSelectScoreP',
                                            cellclick: 'onCellClickScore'
                                        }
                                    }, {
                                        region: 'center',
                                        xtype: 'form',
                                        name: 'schedulingmonthlyscoreP',
                                        bodyStyle: 'padding: 10px 0 0 20px',
                                        layout: 'anchor',
                                        defaults: {
                                            allowBlank: false,
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                allowBlank: true,
                                                xtype: 'hiddenfield',
                                                name: 'id'
                                            }, {
                                                xtype: 'hiddenfield',
                                                name: 'scoretype',
                                                value: 'P'
                                            }, {
                                                xtype: 'hiddenfield',
                                                name: 'schedulingmonthlypartnersid'
                                            }, {
                                                xtype: 'fieldcontainer',
                                                layout: 'hbox',
                                                defaults: {
                                                    allowBlank: false
                                                },
                                                items: [
                                                    {
                                                        flex: 1,
                                                        pageSize: 0,
                                                        fieldLabel: 'Socio',
                                                        name: 'naturalperson',
                                                        hiddenNameId: 'naturalpersonid',
                                                        xtype: 'naturalpersonsearch'
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        // http://stackoverflow.com/questions/13374697/extjs-number-formatting-3-digits-after-decimal
                                                        width: 90,
                                                        name: 'dutyfraction',
                                                        fieldLabel: 'Fracao',
                                                        xtype: 'textfield',
                                                        plugins: 'textmask',
                                                        money: true,
                                                        mask: '0,00',
                                                        value: 1
                                                    }
                                                ]
                                            }, {
                                                fieldLabel: 'Observacoes',
                                                name: 'observation',
                                                xtype: 'textareafield'
                                            }, {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        name: 'username'
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        xtype: 'displayfield',
                                                        name: 'changedate'
                                                    }
                                                ]
                                            }, {
                                                xtype: 'container',
                                                layout: 'hbox',
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        flex: 1
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        flex: 1,
                                                        text: 'Novo',
                                                        xtype: 'button',
                                                        showSmartTheme: 'red-dark',
                                                        handler: 'onInsertScore'
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        flex: 1,
                                                        text: 'Salvar',
                                                        xtype: 'button',
                                                        showSmartTheme: 'red-dark',
                                                        handler: 'onUpdateScore'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

});