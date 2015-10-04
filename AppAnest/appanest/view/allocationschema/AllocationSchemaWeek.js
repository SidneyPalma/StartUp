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

    _columnText: {
        sundescription: 'Domingo',
        mondescription: 'Segunda',
        tuedescription: 'Terca',
        weddescription: 'Quarta',
        thudescription: 'Quinta',
        fridescription: 'Sexta',
        satdescription: 'Sabado'
    },

    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
    },

    _buildDays: function (daysOfWeek) {
        var me = this,
            build = [],
            field = [
                {
                    sortable: false,
                    text: me._columnText['mondescription'],
                    dataIndex: 'mondescription',
                    width: 150,
                    editor: {
                        updateField: 'mon',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['tuedescription'],
                    dataIndex: 'tuedescription',
                    width: 150,
                    editor: {
                        updateField: 'tue',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['weddescription'],
                    dataIndex: 'weddescription',
                    width: 150,
                    editor: {
                        updateField: 'wed',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['thudescription'],
                    dataIndex: 'thudescription',
                    width: 150,
                    editor: {
                        updateField: 'thu',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['fridescription'],
                    dataIndex: 'fridescription',
                    width: 150,
                    editor: {
                        updateField: 'fri',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['satdescription'],
                    dataIndex: 'satdescription',
                    width: 150,
                    editor: {
                        updateField: 'sat',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['sundescription'],
                    dataIndex: 'sundescription',
                    width: 150,
                    editor: {
                        updateField: 'sun',
                        xtype: 'allocationschemasearchshift',
                        name: 'allocationschemadescription'
                    },
                    renderer: me.columnsRenderer
                }
            ];

        for (i = daysOfWeek[0]; i <= daysOfWeek[1]; i++) {
            build.push(field[i]);
        }

        return build;
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
                            var bordertop = parseInt(record.get('bordertop')),
                                first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                                color = parseInt(record.get('rownumber')) % 2 == 0,
                                metaStyle = (color) ? 'background-color: rgba(84, 86, 62, .35);' : 'background-color: rgba(84, 86, 62, .2);';

                            if ((bordertop == 1) && (rowIndex != 0)) {
                                metaStyle += 'border-top: 1px solid #cecece;';
                            }

                            if ((bordertop == 0) && (rowIndex != 0)) {
                                metaStyle += 'border-top: 1px dashed rgba(111, 145, 61, .08);';
                            }

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
                            var metaStyle = '',
                                returnShift = '',
                                returnSubunit = '',
                                subunit = record.get('subunit'),
                                position = record.get('position'),
                                bordertop = parseInt(record.get('bordertop')),
                                returnPosition = Ext.String.format('<div style="float: left; width: 10px;">{0}. </div>',position);

                            if ((bordertop == 1) && (rowIndex != 0)) {
                                metaStyle += 'border-top: 1px solid #cecece;';
                            }

                            switch(value) {
                                case 'D':
                                    metaStyle += 'background-color: rgba(248, 202, 0, .5); line-height: 16px;';
                                    returnShift = '<div style="float: left; width: 20px; text-shadow: 1px 1px 2px rgba(255,160,17, 1);"><i class="icon-sun"></i></div>';
                                    break;
                                case 'N':
                                    metaStyle += 'background-color: rgba(248, 202, 0, .9); line-height: 16px;';
                                    returnShift = '<div style="float: left; width: 20px; text-shadow: 1px 1px 2px rgba(150, 150, 150, 1);"><i class="icon-moon-inv"></i></div>';
                                    break;
                            }

                            if ((bordertop == 0) && (rowIndex != 0)) {
                                metaStyle += 'border-top: 1px dashed rgba(248, 202, 0, .6);';
                            }

                            meta.style = metaStyle;

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
                columns: me._buildDays([0,4])
            }, {
                cls: 'dark',
                text: '<span style="font-size: 18px; font-family: Monda;">FINAL DE SEMANA</span>',
                columns: me._buildDays([5,6])
            }
        ];
    },

    buttonAlign: 'center',

    buttons: [
        {
            glyph: 0xe86c,
            scale: 'medium',
            text: 'Salvar',
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
    ],

    columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
        var metaStyle = '',
            valueDefault = value,
            shift = record.get('shift'),
            enumType = ['001','002','011'],
            bordertop = parseInt(record.get('bordertop')),
            color = parseInt(record.get('position')) % 2 == 0,
            field = this.getColumnManager().columns[colIndex].dataIndex.replace('description','');

        if(shift == 'N') {
            metaStyle = 'background-color: rgba(242, 243, 235, .9);';
        }

        if((colIndex >= 2)&&(enumType.indexOf(record.get(field)) == -1)) {
            valueDefault = '<a style="color: red;">' +valueDefault+ '</a>';
        }

        if ((bordertop == 1) && (rowIndex != 0)) {
            metaStyle += 'border-top: 1px solid #cecece;';
        }

        if ((bordertop == 0) && (rowIndex != 0)) {
            metaStyle += 'border-top: 1px dashed rgba(206, 206, 206, .7);';
        }

        meta.style = metaStyle + ' line-height: 16px; color: rgba(84, 86, 62, .9);';

        return valueDefault;
    }

});