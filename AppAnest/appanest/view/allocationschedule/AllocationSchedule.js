//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationSchedule', {
    extend: 'Ext.container.Container',

    xtype: 'allocationschedule',

    requires: [
        'Ext.picker.Date',
        'AppAnest.view.person.*',
        'Ext.layout.container.SegmentedButton'
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
                                name: 'updatescore',
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
                                                allowToggle: false,
                                                xtype: 'segmentedbutton',
                                                items: [
                                                    {
                                                        scale: 'medium',
                                                        text: 'Novo',
                                                        handler: 'onInsertScore',
                                                        showSmartTheme: 'red'
                                                    }, {
                                                        scale: 'medium',
                                                        text: 'Salvar',
                                                        handler: 'onUpdateScore',
                                                        showSmartTheme: 'red'
                                                    }, {
                                                        scale: 'medium',
                                                        text: 'Fechar',
                                                        handler: 'onClosedScore',
                                                        showSmartTheme: 'green'
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
                                        height: 180,
                                        xtype: 'allocationschedulepicker'
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
                                        xtype: 'allocationschedulescore'
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
                                            fontSize: '24px;',
                                            fontFamily: 'Open Sans'
                                        }
                                    }
                                ]
                            }, {
                                region: 'center',
                                xtype: 'panel',
                                layout: 'fit',
                                name: 'schedulearea',
                                bodyStyle: 'padding: 0 0 0 10px;',
                                items: [
                                    {
                                        xtype: 'allocationscheduleweek'
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