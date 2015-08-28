//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationSchedule', {
    extend: 'Ext.container.Container',

    xtype: 'allocationschedule',

    requires: [
        'Ext.picker.Date',
        'Ext.layout.container.SegmentedButton',
        'AppAnest.view.period.PeriodSearch',
        'AppAnest.view.allocationschedule.AllocationWeek'
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
                                xtype: 'periodsearch',
                                readOnlyColor: false,
                                fieldStyle: {
                                    color: 'blue;',
                                    fontSize: '16px;'
                                },
                                listeners: {
                                    select: 'onSelectPeriod'
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
                                            }, {
                                                disabled: true,
                                                iconCls: 'allocationschedule-month',
                                                cardIndex: 2
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
                                        submitValue: false,
                                        showClear: true,
                                        xtype: 'textfield',
                                        fieldLabel: 'Filtrar Unidade',
                                        listeners: {
                                            change: 'onFilterContractorUnit'
                                        }
                                    }, {
                                        submitValue: false,
                                        showClear: true,
                                        xtype: 'textfield',
                                        fieldLabel: 'Filtrar Sócio',
                                        listeners: {
                                            change: 'onFilterNaturalPerson'
                                        }
                                    }, {
                                        xtype: 'segmentedbutton',
                                        items: [
                                            {
                                                scale: 'medium',
                                                glyph: 0xe887,
                                                text: 'Frequencia',
                                                handler: 'showReport'
                                            },{
                                                scale: 'medium',
                                                glyph: 0xe898,
                                                text: 'Diretoria'
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
                                height: 40,
                                region: 'north',
                                xtype: 'panel'
                            }, {
                                region: 'center',
                                xtype: 'panel',
                                layout: 'fit',
                                bodyStyle: 'padding: 0 0 0 10px;',
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