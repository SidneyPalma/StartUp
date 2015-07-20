//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.SchedulingPlanning', {
    extend: 'Ext.container.Container',

    xtype: 'schedulingplanning',

    requires: [
        'Ext.grid.feature.Summary',
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'Ext.grid.plugin.RowEditing',
        'Ext.selection.CheckboxModel',
        'AppAnest.view.planning.AllocationSchemaSearch'
    ],

    controller: 'schedulingplanning',

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
                        xtype: 'container'
                    }, {
                        width: 30,
                        region: 'west'
                    }, {
                        region: 'center',
                        xtype: 'gridpanel',
                        title: 'Mapeamento de Plantões Noturnos',
                        name: 'schedulingplanning',
                        reference: 'schedulingplanning',
                        hideHeaders: false,
                        rowLines: false,
                        columnLines: true,
                        store: Ext.create('AppAnest.store.scheduling.SchedulingPlanning'),
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
                            //edit: 'onDistributionEdit',
                            beforeedit: 'onAllocationSchemaBeforeEdit'
                            //celldblclick: 'onAllocationSchemaCellDblClick'
                        },
                        columnsRenderer: function (value, meta, record) {
                            var metaStyle = '',
                                shift = record.get('shift'),
                                color = parseInt(record.get('position')) % 2 == 0;

                            if(shift == 'N') {
                                metaStyle = 'background-color: rgba(242, 243, 235, .9);';
                            }

                            meta.style = metaStyle + ' line-height: 16px; color: rgba(84, 86, 62, .9);';

                            return value;
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
                                                last = rowIndex >= store.getCount() - 1 || value !== store.getAt(rowIndex + 1).get('contractorunit');
                                            var color = parseInt(record.get('rownumber')) % 2 == 0,
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
                                            xtype: 'allocationschemasearch',
                                            name: 'allocationschemadescription'
                                        }
                                    }, {
                                        text: 'Terça',
                                        dataIndex: 'tuedescription',
                                        width: 120,
                                        editor: {
                                            updateField: 'tue',
                                            xtype: 'allocationschemasearch',
                                            name: 'allocationschemadescription'
                                        }
                                    }, {
                                        text: 'Quarta',
                                        dataIndex: 'weddescription',
                                        width: 120,
                                        editor: {
                                            updateField: 'wed',
                                            xtype: 'allocationschemasearch',
                                            name: 'allocationschemadescription'
                                        }
                                    }, {
                                        text: 'Quinta',
                                        dataIndex: 'thudescription',
                                        width: 120,
                                        editor: {
                                            updateField: 'thu',
                                            xtype: 'allocationschemasearch',
                                            name: 'allocationschemadescription'
                                        }
                                    }, {
                                        text: 'Sexta',
                                        dataIndex: 'fridescription',
                                        width: 120,
                                        editor: {
                                            updateField: 'fri',
                                            xtype: 'allocationschemasearch',
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
                                            xtype: 'allocationschemasearch',
                                            name: 'allocationschemadescription'
                                        }
                                    }, {
                                        text: '<b>Domingo</b>',
                                        dataIndex: 'sundescription',
                                        width: 120,
                                        editor: {
                                            updateField: 'sun',
                                            xtype: 'allocationschemasearch',
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
                                handler: 'onLoadWeek'
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