//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleScore', {
    extend: 'Ext.form.Panel',

    xtype: 'allocationschedulescore',

    name: 'updatescore',

    requires: [
        'AppAnest.view.person.NaturalPersonSearch',
        'AppAnest.view.person.ContractorUnitSearch'
    ],

    hidden: true,

    layout: 'anchor',

    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    getActiveItem: function () {
        var me = this,
            card = me.down('form[name=selectscore]');

        return card.getLayout().getActiveItem();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                xtype: 'label',
                text: 'Manutencao da Contagem',
                style: 'color: blue; font-size: 14px;'
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
                        { shifthours: 4, shifthoursdescription: '4h' },
                        { shifthours: 6, shifthoursdescription: '6h' },
                        { shifthours: 8, shifthoursdescription: '8h' },
                        { shifthours: 12, shifthoursdescription: '12h' }
                    ]
                },
                listeners: {
                    select: 'onSelectShiftHours'
                }
            }, {
                xtype: 'radiogroup',
                fieldLabel: 'Filtrar',
                labelStyle: 'color: blue; font-size: 14px;',
                columns: 2,
                vertical: true,
                items: [
                    {
                        boxLabel: 'Realizado por',
                        name: 'filterscore',
                        inputValue: 0,
                        checked: true
                    }, {
                        boxLabel: 'Pagar para',
                        name: 'filterscore',
                        inputValue: 1
                    }
                ],
                listeners: {
                    change: 'onFilterScore'
                }
            }, {
                xtype: 'form',
                layout: 'card',
                name: 'selectscore',
                items: [
                    {
                        xtype: 'form',
                        name: 'schedulingmonthlyscoreR',
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
                                allowBlank: true,
                                fieldLabel: 'Observacoes',
                                name: 'observation',
                                xtype: 'textfield'
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
                                xtype: 'gridpanel',
                                name: 'schedulingmonthlyscoreR',
                                columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                    meta.style = "font-size: 16px; line-height: 18px; font-family: Monda; color: rgba(252, 24, 36,.6);";
                                    return value;
                                },
                                store: Ext.create('AppAnest.store.allocationschedule.SchedulingMonthlyScore'),
                                columns: [
                                    {
                                        text: 'Plantonista',
                                        dataIndex: 'naturalperson',
                                        flex: 1
                                    }, {
                                        align: 'center',
                                        width: 50,
                                        dataIndex: '',
                                        renderer: function (value, meta, rec) {
                                            return '<div class="delete-item" style="color: rgba(252, 24, 36,1); font-size: 17px;"><i class="icon-cancel-circle"></i></div>';
                                        }
                                    }
                                ],
                                listeners: {
                                    select: 'onSelectScore',
                                    cellclick: 'onCellClickScore'
                                }
                            }
                        ]
                    }, {
                        xtype: 'form',
                        name: 'schedulingmonthlyscoreP',
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
                                        width: 70,
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
                                allowBlank: true,
                                fieldLabel: 'Observacoes',
                                name: 'observation',
                                xtype: 'textfield'
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
                                xtype: 'gridpanel',
                                name: 'schedulingmonthlyscoreP',
                                columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                    meta.style = "font-size: 16px; line-height: 18px; font-family: Monda; color: rgba(3, 98, 253, 1);";
                                    return ( colIndex == 1 ) ? Smart.maskRenderer('0,00',true)(value) : value;
                                },
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
                                        width: 60
                                    }, {
                                        align: 'center',
                                        width:50,
                                        dataIndex: '',
                                        renderer: function (value, meta, rec) {
                                            return '<div class="delete-item" style="color: rgba(3, 98, 253, 1); font-size: 17px;"><i class="icon-cancel-circle"></i></div>';
                                        }
                                    }
                                ],
                                listeners: {
                                    select: 'onSelectScore',
                                    cellclick: 'onCellClickScore'
                                }
                            }
                        ]
                    }
                ]
            }
        ];

    }

});