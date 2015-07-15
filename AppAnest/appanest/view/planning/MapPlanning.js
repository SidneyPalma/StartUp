//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.MapPlanning', {
    extend: 'Ext.container.Container',

    xtype: 'mapplanning',

    requires: [
        'Ext.grid.feature.Summary',
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'Ext.selection.CheckboxModel',
        'AppAnest.view.period.PeriodSearch',
        'AppAnest.store.scheduling.SchedulingShiftMap'
    ],

    controller: 'mapplanning',

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
        var me = this,
            storeMap = Ext.create('AppAnest.store.scheduling.SchedulingShift', {

                constructor: function () {
                    var me = this, i;

                    for (i = 1; i < 100; i++) {
                        me.fields.push('week'  + Ext.String.leftPad(i, 2, '0'));
                    }

                    me.callParent();
                }
            });

        me.items = [
            {
                frame: true,
                xtype: 'panel',

                glyph: 0xe9d7,

                padding: 10,

                layout: {
                    type: 'border'
                },
                header: {
                    title: 'MAPA - Giro Horizontal',
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
                        width: 300,
                        region: 'west',
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            {
                                region: 'north',
                                xtype: 'form',
                                title: 'Unidades mapeadas',
                                bodyStyle: 'padding-bottom: 10px;',
                                name: 'periodparams',
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%'
                                },
                                items: [
                                    {
                                        useMondaFont: true,
                                        submitValue: true,
                                        xtype: 'comboenum',
                                        name: 'weekdaydescription',
                                        fieldLabel: 'Dia da Semana',
                                        fieldStyle: {
                                            color: 'blue;',
                                            fontSize: '16px;'
                                        },
                                        listeners: {
                                            select: 'onSelectWeekDay',
                                            beforequery: 'onFilterWeekDay'
                                        }
                                    }, {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        defaultType: 'numberfield',
                                        defaults: {
                                            minValue: 1,
                                            useMondaFont: true
                                        },
                                        items: [
                                            {
                                                flex: 1,
                                                value: 20,
                                                name: 'positioncute',
                                                fieldLabel: 'Corte',
                                                listeners: {
                                                    change: 'onChangeCute'
                                                }
                                            }, {
                                                xtype: 'splitter'
                                            }, {
                                                flex: 1,
                                                value: 14,
                                                name: 'frequency',
                                                fieldLabel: 'Frequencia'
                                            }, {
                                                xtype: 'splitter'
                                            }, {
                                                flex: 1,
                                                value: 1,
                                                name: 'positionstart',
                                                fieldLabel: 'Semana'
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                //title: 'Unidades mapeadas',
                                region: 'center',
                                xtype: 'gridpanel',
                                rowLines: false,
                                reference: 'contractorunitlist',
                                store: Ext.create('AppAnest.store.scheduling.SchedulingShiftMap', { pageSize: 0 }),
                                columnsRenderer: function (value, meta, rec) {
                                    var positioncute = rec.get('positioncute'),
                                        metaStyle = "font-size: 14px; line-height: 18px;";
                                    meta.style = positioncute ? metaStyle + ' background-color: rgb(248, 202, 0)' : metaStyle;
                                    return value;
                                },
                                columns: [
                                    {
                                        width: 30,
                                        dataIndex: 'positioncute',
                                        renderer: function (value, meta, rec) {
                                            var positioncute = rec.get('positioncute');
                                            meta.style = positioncute ? 'background-color: rgb(248, 202, 0)' : '';
                                            return value != 0 ? '<span style="color: rgb(153, 0, 0); width: 20px; font-size: 18px;"><i class="icon-right-big"></i></span>' : '';
                                        }
                                    }, {
                                        width: 40,
                                        text: '##',
                                        align: 'center',
                                        dataIndex: 'position',
                                        renderer: function (value, meta, rec) {
                                            var positioncute = rec.get('positioncute'),
                                                metaStyle = "font-size: 14px; line-height: 18px;";
                                            meta.style = positioncute ? metaStyle + ' background-color: rgb(248, 202, 0)' : metaStyle;
                                            return Ext.String.leftPad(value, 2, '0');
                                        }
                                    }, {
                                        flex: 1,
                                        text: 'Unidade',
                                        dataIndex: 'contractorunit'
                                    }, {
                                        width: 60,
                                        text: 'Plantoes',
                                        align: 'right',
                                        dataIndex: 'dutyamount',
                                        summaryType: 'sum',
                                        renderer: function (value, meta, rec) {
                                            var positioncute = rec.get('positioncute'),
                                                metaStyle = "font-size: 14px; line-height: 18px;";
                                            meta.style = positioncute ? metaStyle + ' background-color: rgb(248, 202, 0)' : metaStyle;
                                            return  '...' + value;
                                        },
                                        summaryRenderer: function(value, summaryData, dataIndex) {
                                            return Ext.String.format('<span style="color: #121212; font-size: 18px; font-family: Monda;">{0} plantões </span>',value);
                                        }
                                    }
                                ],
                                features: [
                                    {
                                        ftype: 'summary'
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        glyph: 0xe9d7,
                                        scale: 'medium',
                                        text: 'Processar Mapa',
                                        showSmartTheme: 'red-dark',
                                        handler: 'setProcessMap'
                                    }
                                ],
                                listeners: {
                                    itemdblclick: 'onItemDblClick'
                                }
                            }
                        ]
                    }, {
                        width: 30,
                        region: 'west'
                    }, {
                        region: 'center',
                        xtype: 'gridpanel',
                        title: 'Mapeamento de Plantões Noturnos',
                        reference: 'contractorunitmap',
                        hideHeaders: false,
                        rowLines: false,
                        columnLines: true,
                        //enableLocking: true,
                        store: storeMap,
                        viewConfig: {
                            loadMask: false,
                            loadingText: undefined
                        },
                        columns: [],
                        buttons: [
                            {
                                glyph: 0xe86c,
                                scale: 'medium',
                                text: 'Salvar Planejamento',
                                showSmartTheme: 'green'
                            }
                        ]
                    }
                ]
            }
        ]
    }

});