//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationSchedule', {
    extend: 'Ext.container.Container',

    xtype: 'allocationschedule',

    requires: [
        'Ext.picker.Date',
        'AppAnest.view.person.*',
        'Ext.layout.container.SegmentedButton',
        'AppAnest.view.allocationschedule.SchedulingPeriodSearch'
    ],

    controller: 'allocationschedule',

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
                xtype: 'form',

                glyph: 0xe898,

                padding: 10,

                layout: {
                    type: 'border'
                },
                header: {
                    title: 'Escala Mensal',
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
                        dockedItems: [
                            {
                                name: 'updateScore',
                                hidden: true,
                                xtype: 'toolbar',
                                dock: 'bottom',
                                items: [
                                    {
                                        width: '100%',
                                        xtype: 'container',
                                        layout: 'anchor',
                                        items: [
                                            {
                                                anchor: '100%',
                                                xtype: 'segmentedbutton',
                                                items: [
                                                    {
                                                        scale: 'medium',
                                                        //glyph: 0xe874,
                                                        text: 'Novo',
                                                        handler: 'onInsertScore',
                                                        showSmartTheme: 'red-dark'
                                                    }, {
                                                        scale: 'medium',
                                                        //glyph: 0xe86c,
                                                        text: 'Salvar',
                                                        handler: 'onUpdateScore',
                                                        showSmartTheme: 'red-dark'
                                                    }, {
                                                        scale: 'medium',
                                                        text: 'Fechar',
                                                        showSmartTheme: 'red-dark'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        overflowY: 'auto',
                        width: 250,
                        region: 'west',
                        xtype: 'panel',
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%',
                            useMondaFont: true,
                            labelStyle: 'color: blue; font-size: 14px;'
                        },
                        items: [
                            {
                                status: 'A',
                                params: 'all',
                                xtype: 'schedulingperiodsearch',
                                readOnlyColor: false,
                                fieldStyle: {
                                    color: 'blue;',
                                    fontSize: '16px;'
                                },
                                listeners: {
                                    select: 'onSelectPeriod',
                                    beforequery: 'onBeforeQuery'
                                }
                            }, {
                                xtype: 'container',
                                layout: 'anchor',
                                disabled: true,
                                name: 'schedule',
                                defaults: {
                                    anchor: '100%',
                                    useMondaFont: true,
                                    labelStyle: 'color: blue; font-size: 14px;'
                                },
                                items: [
                                    {
                                        margin: '0 0 5 0',
                                        xtype: 'segmentedbutton',
                                        defaults: {
                                            scale: 'large',
                                            showSmartTheme: 'lemon',
                                            handler: 'getCardIndex'
                                        },
                                        items: [
                                            {
                                                iconCls: 'allocationschedule-day',
                                                cardIndex: 0
                                            }, {
                                                iconCls: 'allocationschedule-week',
                                                cardIndex: 1,
                                                pressed: true
                                            //}, {
                                            //    iconCls: 'allocationschedule-month',
                                            //    cardIndex: 2
                                            }
                                        ]
                                    }, {
                                        cls: 'smart',
                                        xtype: 'datepicker',
                                        showToday: false,
                                        listeners: {
                                            select: 'startDatePicker'
                                        }
                                    }, {
                                        xtype: 'radiogroup',
                                        name: 'filter',
                                        fieldLabel: 'Filtrar',
                                        labelStyle: 'color: blue; font-size: 14px;',
                                        columns: 2,
                                        vertical: true,
                                        items: [
                                            {
                                                boxLabel: 'Unidade',
                                                name: 'filtertype',
                                                inputValue: 1,
                                                checked: true
                                            }, {
                                                boxLabel: 'Sócio',
                                                name: 'filtertype',
                                                inputValue: 2
                                            }
                                        ]
                                    }, {
                                        submitValue: false,
                                        showClear: true,
                                        xtype: 'textfield',
                                        listeners: {
                                            change: 'onFilterSchedule'
                                        }
                                    }, {
                                    //    disabled: true,
                                    //    name: 'monthlyscore',
                                    //    xtype: 'checkboxfield',
                                    //    boxLabel: 'Habilitar Contagem',
                                    //    listeners: {
                                    //        change: 'onChangeMonthlyScore'
                                    //    }
                                    //}, {
                                        margin: '0 0 5 0',
                                        xtype: 'segmentedbutton',
                                        allowToggle: false,
                                        items: [
                                            {
                                                scale: 'medium',
                                                xtype: 'splitbutton',
                                                glyph: 0xe887,
                                                text: 'Folha',
                                                handler: 'showFrequencySheet',
                                                menu: [
                                                    {
                                                        handler: 'showselectSchedule',
                                                        text: 'Gerar arquivo da Escala Mensal'
                                                    }
                                                ]
                                            }, {
                                                scale: 'medium',
                                                glyph: 0xe898,
                                                text: 'Diretoria',
                                                handler: 'showDirectorShip'
                                            }
                                        ]
                                    }, {
                                        name: 'changestatus',
                                        xtype: 'segmentedbutton',
                                        vertical: true,
                                        allowToggle: false,
                                        items: [
                                            {
                                                disabled: true,
                                                name: 'statusP',
                                                glyph: 0xef67,
                                                scale: 'medium',
                                                text: 'Publicar Escala',
                                                showSmartTheme: 'sky',
                                                handler: 'showPublishSchedule'
                                            }, {
                                                disabled: true,
                                                name: 'statusC',
                                                glyph: 0xef17,
                                                scale: 'medium',
                                                text: 'Processar Contagem',
                                                showSmartTheme: 'sky',
                                                handler: 'startScheduleScore'
                                            }, {
                                                disabled: true,
                                                name: 'statusE',
                                                glyph: 0xef2a,
                                                scale: 'medium',
                                                text: 'Encerrar Contagem',
                                                showSmartTheme: 'sky'
                                            }
                                        ]
                                    }, {
                                        name: 'updateScore',
                                        hidden: true,
                                        xtype: 'form',
                                        layout: 'anchor',
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
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
                                                defaults: {
                                                    flex: 1
                                                },
                                                height: 250,
                                                xtype: 'tabpanel',
                                                name: 'navigation-items',
                                                ui: 'navigation-items',
                                                tabBar: {
                                                    layout: {
                                                        pack: 'center'
                                                    }
                                                },
                                                listeners: {
                                                    tabchange: 'onTabChange'
                                                },
                                                items: [
                                                    {
                                                        cardIndex: 0,
                                                        glyph: 0xe953,
                                                        title: 'Realizado por',
                                                        xtype: 'container',
                                                        name: 'containersubmit',
                                                        layout: 'border',
                                                        items: [
                                                            {
                                                                region: 'north',
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
                                                                    }
                                                                ]
                                                            }, {
                                                                region: 'center',
                                                                xtype: 'gridpanel',
                                                                columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                                                    meta.style = "font-size: 16px; line-height: 18px; font-family: Monda; color: rgba(252, 24, 36,.6);";
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
                                                                        width: 50,
                                                                        dataIndex: '',
                                                                        renderer: function (value, meta, rec) {
                                                                            return '<div class="delete-item" style="color: rgba(252, 24, 36,1); font-size: 17px;"><i class="icon-cancel-circle"></i></div>';
                                                                        }
                                                                    }
                                                                ],
                                                                listeners: {
                                                                    select: 'onSelectScoreR',
                                                                    cellclick: 'onCellClickScore'
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        cardIndex: 1,
                                                        glyph: 0xee03,
                                                        title: 'Pagar para',
                                                        xtype: 'container',
                                                        name: 'containersubmit',
                                                        layout: 'border',
                                                        items: [
                                                            {
                                                                region: 'center',
                                                                xtype: 'gridpanel',
                                                                columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                                                    meta.style = "font-size: 16px; line-height: 18px; font-family: Monda; color: rgba(3, 98, 253, 1);";
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
                                                                    select: 'onSelectScoreP',
                                                                    cellclick: 'onCellClickScore'
                                                                }
                                                            }, {
                                                                region: 'north',
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
                    }, {
                        region: 'center',
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            {
                                height: 26,
                                region: 'north',
                                xtype: 'panel',
                                items: [
                                    {
                                        margin: '10 0 0 10',
                                        xtype: 'label',
                                        text: '...',
                                        name: 'labelperiod',
                                        style: {
                                            color: '#457EC5;',
                                            fontSize: '24px;'
                                        }
                                    }
                                ]
                            }, {
                                region: 'center',
                                xtype: 'panel',
                                name: 'schedulearea',
                                bodyStyle: 'padding: 0 0 0 10px;',
                                autoScroll: true,
                                layout: {
                                    type: 'anchor',
                                    reserveScrollbar: true
                                },
                                items: [
                                    {
                                        xtype: 'allocationweek'
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