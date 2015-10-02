//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchemaWeek', {
    extend: 'Ext.grid.Panel',

    xtype: 'allocationschemaweek',

    cls: 'allocationschemaweek',

    requires: [
        'Ext.grid.feature.Summary',
        'Ext.grid.plugin.RowEditing',
        'Ext.selection.CheckboxModel'
    ],

    name: 'schemamonthly',

    rowLines: false,
    autoScroll: true,
    columnLines: true,
    hideHeaders: false,

    store: 'allocationschemamonthly',

    viewConfig: {
        loadMask: false,
        loadingText: undefined,
        scroll:false,
        style:{
            overflow: 'auto',
            overflowX: 'hidden'
        }
    },

    selModel: 'rowmodel',

    plugins: {
        ptype: 'rowediting',
        clicksToEdit: 2
    },

    listeners: {
        beforeedit: 'onAllocationSchemaBeforeEdit'
    },

    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
    },

    buildField: function () {
        var me = this;

        Ext.create('AppAnest.store.allocationschema.AllocationSchemaMonthly');

        me.columns = [
            {
                cls: 'dark',
                text: '<a style="font-size: 18px; font-family: Monda;">' + 'U N I D A D E S' + '</a>',
                columns: [
                    {
                        width: 200,
                        text: 'Unidade',
                        dataIndex: 'contractorunit',
                        renderer: function (value, meta, record, rowIndex, colIndex, store) {
                            var first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                                color = parseInt(record.get('rownumber')) % 2 == 0,
                                metaStyle = (color) ? 'background-color: rgba(84, 86, 62, .35);' : 'background-color: rgba(84, 86, 62, .2);';

                            metaStyle += ' font-size: 16px; line-height: 16px; font-family: Monda; border-left: 1px solid #cecece;';
                            meta.style = metaStyle;

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
                                case '003':
                                    returnSubunit = '<div style="float: right; width: 20px; color: rgb(252, 24, 36); text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-heart"></i></div>';
                                    break;
                                case '005':
                                    returnSubunit = '<div style="float: right; width: 20px; color: rgb(23, 153, 138); text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-chat"></i></div>';
                                    break;
                                case '004':
                                    returnSubunit = '<div style="float: right; width: 20px; color: rgb(0, 29, 196); text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-h-sigh"></i></div>';
                                    break;
                                case '000':
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
                cls: 'ligth',
                text: '<span style="font-size: 18px; font-family: Monda;">DIAS DA SEMANA</span>',
                columns: [
                    {
                        text: 'Segunda',
                        dataIndex: 'mondescription',
                        width: 150,
                        editor: {
                            updateField: 'mon',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }, {
                        text: 'Terca',
                        dataIndex: 'tuedescription',
                        width: 150,
                        editor: {
                            updateField: 'tue',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }, {
                        text: 'Quarta',
                        dataIndex: 'weddescription',
                        width: 150,
                        editor: {
                            updateField: 'wed',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }, {
                        text: 'Quinta',
                        dataIndex: 'thudescription',
                        width: 150,
                        editor: {
                            updateField: 'thu',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }, {
                        text: 'Sexta',
                        dataIndex: 'fridescription',
                        width: 150,
                        editor: {
                            updateField: 'fri',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }
                ]
            }, {
                cls: 'dark',
                text: '<span style="font-size: 18px; font-family: Monda;">FINAL DE SEMANA</span>',
                columns: [
                    {
                        text: '<b>Sabado</b>',
                        dataIndex: 'satdescription',
                        width: 150,
                        editor: {
                            updateField: 'sat',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }, {
                        text: '<b>Domingo</b>',
                        dataIndex: 'sundescription',
                        width: 150,
                        editor: {
                            updateField: 'sun',
                            xtype: 'allocationschemasearchshift',
                            name: 'allocationschemadescription'
                        }
                    }
                ]
            }
        ];
    },

    columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
        var metaStyle = '',
            valueDefault = value,
            enumType = ['001','002','011'],
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

    buttonAlign: 'center',

    buttons: [
        {
            glyph: 0xe86c,
            scale: 'medium',
            text: 'Salvar Escala',
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

});