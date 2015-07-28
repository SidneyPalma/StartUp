//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchema', {
    extend: 'Ext.container.Container',

    xtype: 'allocationschema',

    requires: [
        'Ext.grid.feature.Summary',
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'Ext.grid.plugin.RowEditing',
        'Ext.selection.CheckboxModel',
        'AppAnest.view.planning.AllocationSchemaShift',
        'AppAnest.store.allocationschema.AllocationSchema',
        'AppAnest.store.allocationschema.AllocationSchemaMap',
        'AppAnest.store.allocationschema.AllocationSchemaMonthly',
        'AppAnest.store.allocationschema.AllocationSchemaWeekDay'
    ],

    controller: 'allocationschema',

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

        Ext.create('AppAnest.store.allocationschema.AllocationSchema');
        Ext.create('AppAnest.store.allocationschema.AllocationSchemaMap');
        Ext.create('AppAnest.store.allocationschema.AllocationSchemaMonthly');
        Ext.create('AppAnest.store.allocationschema.AllocationSchemaWeekDay', {
            constructor: function () {
                var me = this, i;
                for (i = 1; i < 100; i++) {
                    me.fields.push('week' + Ext.String.leftPad(i, 2, '0'));
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
                    title: 'Agenda - Planejamento de Calculo',
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
                        xtype: 'panel',
                        items: [
                            {
                                title: 'Esquemas de atribuição de plantões',
                                xtype: 'form',
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%',
                                    useMondaFont: true
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
                                        xtype: 'radiogroup',
                                        columns: 2,
                                        vertical: false,
                                        fieldLabel: 'Tipo',
                                        items: [
                                            {
                                                itemId: 'type0',
                                                boxLabel: 'Escala',
                                                name: 'type',
                                                inputValue: 0,
                                                checked: true
                                            }, {
                                                itemId: 'type1',
                                                disabled: true,
                                                boxLabel: 'Mapa',
                                                name: 'type',
                                                inputValue: 1
                                            }
                                        ],
                                        listeners: {
                                            change: 'onChangeSchemaMonthlyType'
                                        }
                                    }, {
                                        xtype: 'container',
                                        layout: 'card',
                                        name: 'schema',
                                        disabled: true,
                                        items: [
                                            {
                                                xtype: 'form',
                                                name: 'schemamonthly',
                                                layout: 'anchor',
                                                defaults: {
                                                    anchor: '100%',
                                                    useMondaFont: true
                                                },
                                                items: [
                                                    {
                                                        xtype: 'hiddenfield',
                                                        name: 'id'
                                                    }, {
                                                        xtype: 'hiddenfield',
                                                        name: 'periodid'
                                                    }, {
                                                        xtype: 'hiddenfield',
                                                        name: 'schemaweek'
                                                    }, {
                                                        xtype: 'textfield',
                                                        name: 'description',
                                                        fieldLabel: 'Descrição'
                                                    }, {
                                                        xtype: 'textareafield',
                                                        name: 'observation',
                                                        fieldLabel: 'Observação'
                                                    }, {
                                                        showClear: true,
                                                        xtype: 'textfield',
                                                        submitValue: false,
                                                        fieldLabel: 'Filtrar Unidade',
                                                        listeners: {
                                                            change: 'onChangeFilterMonthly'
                                                        }
                                                    }
                                                ]
                                            }, {
                                                xtype: 'form',
                                                name: 'schemaweekday',
                                                layout: 'anchor',
                                                defaults: {
                                                    anchor: '100%',
                                                    useMondaFont: true
                                                },
                                                items: [
                                                    {
                                                        showClear: true,
                                                        xtype: 'textfield',
                                                        submitValue: false,
                                                        fieldLabel: 'Filtrar Unidade',
                                                        listeners: {
                                                            change: 'onChangeFilterWeekly'
                                                        }
                                                    }, {
                                                        xtype: 'gridpanel',
                                                        name: 'schemamonthlymap',
                                                        store: 'allocationschemamap',
                                                        columns: [
                                                            {
                                                                flex: 1,
                                                                text: 'Dias da Semana',
                                                                dataIndex: 'weekdaydescription',
                                                                renderer: function (value, meta, record, rowIndex, colIndex, store) {
                                                                    meta.style = 'font-size: 16px; line-height: 22px; font-family: Monda;';
                                                                    return value;
                                                                }
                                                            }, {
                                                                width: 50,
                                                                align: 'center',
                                                                renderer: function (value, meta, rec) {
                                                                    var schemamap = rec.get('schemamap') || '',
                                                                        strSelected = '<span style="color: {0}; width: 20px; font-size: 20px; line-height: 22px;"><i class="{1}"></i></span>';
                                                                    return (schemamap.length != 0) ? Ext.String.format(strSelected,'rgba(110, 123, 139, .3)','icon-map') : Ext.String.format(strSelected,'rgba(110, 123, 139, .3)','');
                                                                }
                                                            }, {
                                                                width: 50,
                                                                align: 'center',
                                                                renderer: function (value, meta, rec) {
                                                                    var strSelected = '<span style="color: {0}; width: 20px; font-size: 20px; line-height: 22px;"><i class="{1}"></i></span>';
                                                                    return (rec.get('isselected')) ? Ext.String.format(strSelected,'rgba(251, 60, 74, 1)','icon-ok-circled') : Ext.String.format(strSelected,'rgba(110, 123, 139, .3)','icon-ok-circled2');
                                                                }
                                                            }
                                                        ],
                                                        listeners: {
                                                            celldblclick: 'onCellDblClick'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }, {
                        width: 30,
                        region: 'west'
                    }, {
                        region: 'center',
                        xtype: 'container',
                        layout: 'card',
                        reference: 'allocationschemap',
                        items: [
                            {
                                title: 'Agenda Semanal',
                                xtype: 'gridpanel',
                                name: 'schemamonthly',
                                rowLines: false,
                                columnLines: true,
                                hideHeaders: false,
                                store: 'allocationschemamonthly',
                                viewConfig: {
                                    loadMask: false,
                                    loadingText: undefined
                                },
                                selModel: 'rowmodel',
                                plugins: {
                                    ptype: 'rowediting',
                                    clicksToEdit: 2
                                },
                                listeners: {
                                    beforeedit: 'onAllocationSchemaBeforeEdit'
                                },
                                columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
                                    var metaStyle = '',
                                        valueDefault = value,
                                        enumType = ['001','002'],
                                        shift = record.get('shift'),
                                        color = parseInt(record.get('position')) % 2 == 0,
                                        field = this.getColumnManager().columns[colIndex].dataIndex.replace('description','');

                                    if(shift == 'N') {
                                        metaStyle = 'background-color: rgba(242, 243, 235, .9);';
                                    }

                                    if((colIndex >= 2)&&(enumType.indexOf(record.get(field)) == -1)) {
                                        valueDefault = '<a style="color: red;">' +valueDefault+ '</a>';
                                    }

                                    meta.style = metaStyle + ' line-height: 16px; color: rgba(84, 86, 62, .9);';

                                    return valueDefault;
                                },
                                columns: [
                                    {
                                        text: '<a style="color: blue; font-size: 18px; font-family: Monda;">' + 'U N I D A D E S' + '</a>',
                                        columns: [
                                            {
                                                width: 200,
                                                text: 'Unidade',
                                                dataIndex: 'contractorunit',
                                                renderer: function (value, meta, record, rowIndex, colIndex, store) {
                                                    var first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                                                        color = parseInt(record.get('rownumber')) % 2 == 0,
                                                        metaStyle = (color) ? 'color: white; background-color: rgba(84, 86, 62, .9);' : 'background-color: rgba(84, 86, 62, .4);';

                                                    meta.style = metaStyle + ' font-size: 16px; line-height: 16px; font-family: Monda;';

                                                    if (first) {
                                                        var i = rowIndex + 1;
                                                        while (i < store.getCount() && value === store.getAt(i).get('contractorunit')) {
                                                            i++;
                                                        }
                                                    }

                                                    return first ? value : '';
                                                }
                                            }, {
                                                width: 74,
                                                text: 'Turnos',
                                                dataIndex: 'shift',
                                                renderer: function (value, meta, record, rowIndex, colIndex, store) {
                                                    var returnShift = '',
                                                        returnSubunit = '',
                                                        subunit = record.get('subunit'),
                                                        position = record.get('position'),
                                                        returnPosition = Ext.String.format('<div style="float: left; width: 10px;">{0}. </div>',position);

                                                    switch(value) {
                                                        case 'D':
                                                            meta.style = 'background-color: rgba(248, 202, 0, .5); line-height: 16px;';
                                                            returnShift = '<div style="float: left; width: 20px; text-shadow: 1px 1px 2px rgba(255,160,17, 1);"><i class="icon-sun"></i></div>';
                                                            break;
                                                        case 'N':
                                                            meta.style = 'background-color: rgba(248, 202, 0, .9); line-height: 16px;';
                                                            returnShift = '<div style="float: left; width: 20px; text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-moon-inv"></i></div>';
                                                            break;
                                                    }

                                                    switch(subunit) {
                                                        case 'C':
                                                            returnSubunit = '<div style="float: right; width: 20px; color: rgb(252, 24, 36); text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-heart"></i></div>';
                                                            break;
                                                        case 'N':
                                                            returnSubunit = '<div style="float: right; width: 20px; color: rgb(23, 153, 138); text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-chat"></i></div>';
                                                            break;
                                                        case 'H':
                                                            returnSubunit = '<div style="float: right; width: 20px; color: rgb(0, 29, 196); text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-h-sigh"></i></div>';
                                                            break;
                                                        case 'P':
                                                            returnSubunit = '';
                                                            break;
                                                        default:
                                                            returnSubunit = '<div style="float: right; width: 20px; text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-cogs"></i></div>';
                                                            break;
                                                    }

                                                    return  '<div style="font-size: 15px;">' +
                                                        returnPosition +
                                                        returnShift +
                                                        returnSubunit +
                                                    '</div>';
                                                }
                                            }
                                        ]
                                    }, {
                                        text: '<span style="color: blue; font-size: 18px; font-family: Monda;">DIAS DA SEMANA</span>',
                                        columns: [
                                            {
                                                text: 'Segunda',
                                                dataIndex: 'mondescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'mon',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }, {
                                                text: 'Terça',
                                                dataIndex: 'tuedescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'tue',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }, {
                                                text: 'Quarta',
                                                dataIndex: 'weddescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'wed',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }, {
                                                text: 'Quinta',
                                                dataIndex: 'thudescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'thu',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }, {
                                                text: 'Sexta',
                                                dataIndex: 'fridescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'fri',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }
                                        ]
                                    }, {
                                        text: '<span style="color: blue; font-size: 18px; font-family: Monda;">FINAL DE SEMANA</span>',
                                        columns: [
                                            {
                                                text: '<b>Sábado</b>',
                                                dataIndex: 'satdescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'sat',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }, {
                                                text: '<b>Domingo</b>',
                                                dataIndex: 'sundescription',
                                                width: 120,
                                                editor: {
                                                    updateField: 'sun',
                                                    xtype: 'allocationschemasearchshift',
                                                    name: 'allocationschemadescription'
                                                }
                                            }
                                        ]
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        glyph: 0xe86c,
                                        scale: 'medium',
                                        text: 'Salvar Planejamento',
                                        showSmartTheme: 'red-dark',
                                        handler: 'onUpdateSchemaMonthly'
                                    }, {
                                        glyph: 0xec9d,
                                        scale: 'medium',
                                        text: 'Limpar',
                                        showSmartTheme: 'sky',
                                        handler: 'onDeleteMonthly'
                                    }, {
                                        glyph: 0xe869,
                                        scale: 'medium',
                                        text: 'Voltar',
                                        showSmartTheme: 'green',
                                        handler: 'onHistoryBack'
                                    }
                                ]
                            }, {
                                xtype: 'gridpanel',
                                title: 'Mapeamento de Plantões Noturnos',
                                name: 'schemaweekday',
                                hideHeaders: false,
                                rowLines: false,
                                columnLines: true,
                                store: 'allocationschemaweekday',
                                //viewConfig: {
                                //    loadMask: false,
                                //    loadingText: undefined
                                //},
                                columns: [],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        glyph: 0xe86c,
                                        scale: 'medium',
                                        text: 'Salvar Planejamento',
                                        showSmartTheme: 'red-dark',
                                        handler: 'onUpdateSchemaWeekDay'
                                    }, {
                                        glyph: 0xec9d,
                                        scale: 'medium',
                                        text: 'Limpar',
                                        showSmartTheme: 'sky',
                                        handler: 'onDeleteWeekDay'
                                    }, {
                                        glyph: 0xe869,
                                        scale: 'medium',
                                        text: 'Voltar',
                                        showSmartTheme: 'green',
                                        handler: 'onHistoryBack'
                                    }
                                ],
                                listeners: {
                                    celldblclick: 'onCellDblClickWeekDay'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }

});