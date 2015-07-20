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
                                title: 'Unidades Mapeadas',
                                //bodyStyle: 'padding-bottom: 5px;',
                                name: 'periodparams',
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%'
                                },
                                style: {
                                    borderBottom: 'solid 1px #cecece'
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
                                                fieldLabel: 'Posição'
                                            }
                                        ]
                                    }, {
                                        checked: true,
                                        xtype: 'checkboxfield',
                                        name: 'highlight',
                                        boxLabel: 'Destacar resultados obtidos'
                                    }
                                ]
                            }, {
                                region: 'center',
                                xtype: 'gridpanel',
                                rowLines: false,
                                cls: 'grid-row-span',
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
                                            return value != 0 ? '<span style="color: rgb(153, 0, 0); font-size: 18px;"><i class="icon-right-big"></i></span>' : '';
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
                                        align: 'center',
                                        renderer: function (value, meta, rec) {
                                            var positioncute = rec.get('positioncute'),
                                                metaStyle = "font-size: 14px; line-height: 18px;";
                                            meta.style = positioncute ? metaStyle + ' background-color: rgb(248, 202, 0)' : metaStyle;
                                            return  '<div style="color: rgba(105, 210, 231, .5); font-size: 18px;">' +
                                                        '<div class="icon-move-hover" style="float: left; width: 20px; cursor: pointer;"><i class="icon-up-big"></i></div>' +
                                                        '<div class="icon-move-hover" style="float: right; width: 20px; cursor: pointer;"><i class="icon-down-big"></i></div>' +
                                                    '</div>';
                                        }
                                    }, {
                                        width: 40,
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
                                        showSmartTheme: 'sky',
                                        handler: 'setProcessMap'
                                    }
                                ],
                                listeners: {
                                    celldblclick: 'onCellDblClick'
                                }
                            }
                        ]
                    }, {
                        width: 30,
                        region: 'west'
                    }, {
                        //tools: [
                        //    {
                        //        type: 'help',
                        //        callback: 'onHelp'
                        //    }
                        //],
                        region: 'center',
                        xtype: 'gridpanel',
                        title: 'Mapeamento de Plantões Noturnos',
                        reference: 'contractorunitmap',
                        hideHeaders: false,
                        rowLines: false,
                        columnLines: true,
                        store: storeMap,
                        viewConfig: {
                            loadMask: false,
                            loadingText: undefined
                        },
                        columns: [],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                glyph: 0xe86c,
                                scale: 'medium',
                                text: 'Salvar Planejamento',
                                showSmartTheme: 'red-dark'
                            }, {
                                glyph: 0xe869,
                                scale: 'medium',
                                text: 'Voltar',
                                showSmartTheme: 'green',
                                handler: 'onHistoryBack'
                            }
                        ]
                    }
                ]
            }
        ]
    }

});