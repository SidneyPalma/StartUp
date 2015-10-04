//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleWeek', {
    extend: 'Ext.grid.Panel',

    xtype: 'allocationscheduleweek',

    cls: 'allocationscheduleweek',

    status: 'A',

    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
    },

    rowLines: false,
    autoScroll: true,
    columnLines: true,
    hideHeaders: false,

    store: 'allocationschedule',

    viewConfig: {
        loadMask: false,
        loadingText: undefined,
        scroll:false,
        style:{
            overflow: 'auto',
            overflowX: 'hidden'
        }
    },

    listeners: {
        cellclick: 'onCellClick',
        cellkeydown: 'onCellKeyDown',
        celldblclick: 'onScheduleCelldDlclick',
        beforeitemclick: 'onBeforeItemKeyDown',
        beforeitemkeydown: 'onBeforeItemKeyDown'
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

    columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
        var me = this,
            metaStyle = '',
            status = me.status,
            valueDefault = value,
            shift = record.get('shift'),
            enumType = ['010','011','012','013'],
            bordertop = parseInt(record.get('bordertop')),
            color = parseInt(record.get('position')) % 2 == 0,
            field = this.getColumnManager().columns[colIndex].dataIndex.replace('description','schema'),
            cell =  '<div>' +
                        '<div style="float: left; width: 90%;">{0}</div>' +
                        '<div style="float: left; width: 10%;" class="delete-item">' +
                            '<i class="icon-cancel-squared"></i>' +
                        '</div>' +
                    '</div>';

        if(shift == 'N') {
            metaStyle = 'background-color: rgba(242, 243, 235, .9);';
        }

        if((colIndex >= 2)&&(enumType.indexOf(record.get(field)) != -1)) {
            valueDefault = '<a style="color: red;">' +valueDefault+ '</a>';
        }

        if ((bordertop == 1) && (rowIndex != 0)) {
            metaStyle += 'border-top: 1px solid #cecece;';
        }

        if ((bordertop == 0) && (rowIndex != 0)) {
            metaStyle += 'border-top: 1px dashed rgba(206, 206, 206, .7);';
        }

        metaStyle += ' line-height: 16px; color: rgba(84, 86, 62, .9);';

        meta.style = metaStyle;

        if (status == 'A') {
            return (value !== '...') ? Ext.String.format(cell,valueDefault) : '';
        } else {
            return (valueDefault) ? valueDefault : '';
        }
    },

    _getGroup: function () {
        var me = this,
            status = me.status,
            enumStatus = ['A','C'],
            group = [
                {
                    width: 200,
                    text: 'Unidade',
                    dataIndex: 'contractorunit',
                    renderer: function (value, meta, record, rowIndex, colIndex, store) {
                        var bordertop = parseInt(record.get('bordertop')),
                            first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                            color = parseInt(record.get('rownumber')) % 2 == 0,
                            metaStyle = (color) ? 'background-color: rgba(111, 145, 61, .35);' : 'background-color: rgba(111, 145, 61, .2);',
                            cell =  '<div>' +
                                        '<div style="float: left; width: 90%;">{0}</div>' +
                                        '<div style="float: left; width: 10%; {1}" class="insert-item">' +
                                            '<i class="icon-plus-squared"></i>' +
                                        '</div>' +
                                    '</div>';

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

                        if (enumStatus.indexOf(status) != -1 ) {
                            return (first) ? ( status == 'A' ? Ext.String.format(cell,value) : Ext.String.format(cell,value,'color: rgba(250, 105, 0, .7);') ) : '';
                        } else {
                            return (first) ? value : '';
                        }
                    }
                }, {
                    width: 74,
                    text: 'Turnos',
                    sortable: false,
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
            ];

        return group;
    },

    _buildDays: function (daysOfWeek,pickerView,dataIndex) {
        var me = this,
            build = [],
            field = [
                {
                    sortable: false,
                    text: me._columnText['mondescription'],
                    dataIndex: 'mondescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['tuedescription'],
                    dataIndex: 'tuedescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['weddescription'],
                    dataIndex: 'weddescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['thudescription'],
                    dataIndex: 'thudescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: me._columnText['fridescription'],
                    dataIndex: 'fridescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: '<b>' + me._columnText['satdescription'] + '</b>',
                    dataIndex: 'satdescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }, {
                    sortable: false,
                    text: '<b>' + me._columnText['sundescription'] + '</b>',
                    dataIndex: 'sundescription',
                    width: 150,
                    renderer: me.columnsRenderer
                }
            ];

        if(daysOfWeek) {
            for (i = daysOfWeek[0]; i <= daysOfWeek[1]; i++) {
                build.push(field[i]);
            }
        }

        if(pickerView == 'vwDay') {
            build = [
                {
                    cls: 'dark',
                    flex: 1,
                    sortable: false,
                    text: me._columnText[dataIndex],
                    dataIndex: dataIndex,
                    renderer: me.columnsRenderer
                }
            ]
        }

        return build;
    },

    buildField: function () {
        var me = this;

        Ext.create('AppAnest.store.allocationschedule.AllocationSchedule');

        me.columns = [
            {
                cls: 'dark',
                text: '<a style="font-size: 18px; font-family: Monda;">' + 'U N I D A D E S' + '</a>',
                columns: me._getGroup()
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
    }

});