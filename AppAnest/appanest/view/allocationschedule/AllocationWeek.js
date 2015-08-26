//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationWeek', {
    extend: 'Ext.grid.Panel',

    xtype: 'allocationweek',

    cls: 'allocationweek',

    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
    },

    rowLines: false,
    columnLines: true,
    hideHeaders: false,

    store: 'allocationschedule',

    viewConfig: {
        loadMask: false,
        loadingText: undefined
    },

    listeners: {
        celldblclick: 'onScheduleCelldDlclick'
    },

    columnsRenderer: function (value, meta, record, rowIndex, colIndex, store) {
        var metaStyle = '',
            valueDefault = value,
            shift = record.get('shift'),
            enumType = ['010','011','012','013'],
            bordertop = parseInt(record.get('bordertop')),
            color = parseInt(record.get('position')) % 2 == 0,
            field = this.getColumnManager().columns[colIndex].dataIndex.replace('description','schema');

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

        return (valueDefault) ? valueDefault : '';
    },

    _getGroup: function () {
        var group = [
                {
                    cls: 'x-column-header-inner-dark',
                    width: 200,
                    text: 'UNIDADE',
                    dataIndex: 'contractorunit',
                    renderer: function (value, meta, record, rowIndex, colIndex, store) {
                        var bordertop = parseInt(record.get('bordertop')),
                            color = parseInt(record.get('rownumber')) % 2 == 0,
                            first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                            metaStyle = (color) ? 'background-color: rgba(185, 233, 251, .8);' : 'background-color: rgba(185, 233, 251, .3);';

                        if (first) {
                            var i = rowIndex + 1;
                            while (i < store.getCount() && value === store.getAt(i).get('contractorunit')) {
                                i++;
                            }
                        }

                        if ((bordertop == 1) && (rowIndex != 0)) {
                            metaStyle += 'border-top: 1px solid #cecece;';
                        }

                        if ((bordertop == 0) && (rowIndex != 0)) {
                            metaStyle += 'border-top: 1px dashed rgba(185, 233, 251, .3);';
                        }

                        metaStyle += ' font-size: 16px; line-height: 16px; font-family: Monda; border-left: 1px solid #cecece;';

                        meta.style = metaStyle;

                        return first ? value : '';
                    }
                }, {
                    cls: 'x-column-header-inner-dark',
                    width: 74,
                    text: 'TURNOS',
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
            ];

        return group;
    },

    _getField: function (dataIndex, pickerView) {
        var me = this,
            field = [
            {
                flex: 1,
                text: 'SEGUNDA-FEIRA',
                dataIndex: 'mondescription',
                renderer: me.columnsRenderer
            }, {
                flex: 1,
                text: 'TERCA-FEIRA',
                dataIndex: 'tuedescription',
                renderer: me.columnsRenderer
            }, {
                flex: 1,
                text: 'QUARTA-FEIRA',
                dataIndex: 'weddescription',
                renderer: me.columnsRenderer
            }, {
                flex: 1,
                text: 'QUINTA-FEIRA',
                dataIndex: 'thudescription',
                renderer: me.columnsRenderer
            }, {
                flex: 1,
                text: 'SEXTA-FEIRA',
                dataIndex: 'fridescription',
                renderer: me.columnsRenderer
            }, {
                cls: 'x-column-header-inner-dark',
                flex: 1,
                text: 'SABADO',
                dataIndex: 'satdescription',
                renderer: me.columnsRenderer
            }, {
                cls: 'x-column-header-inner-dark',
                flex: 1,
                text: 'DOMINGO',
                dataIndex: 'sundescription',
                renderer: me.columnsRenderer
            }
        ];

        if(pickerView == 'vwDay') {
            var text = {
                sundescription: 'DOMINGO',
                mondescription: 'SEGUNDA-FEIRA',
                tuedescription: 'TERCA-FEIRA',
                weddescription: 'QUARTA-FEIRA',
                thudescription: 'QUINTA-FEIRA',
                fridescription: 'SEXTA-FEIRA',
                satdescription: 'SABADO'
            };
            field = [
                {
                    cls: 'x-column-header-inner-dark',
                    flex: 1,
                    text: text[dataIndex],
                    dataIndex: dataIndex,
                    renderer: me.columnsRenderer
                }
            ]
        }

        return field;
    },

    buildModel: function (dataIndex, pickerView) {
        var me = this,
            store = Ext.getStore('allocationschedule');

        Ext.suspendLayouts();
        me.reconfigure(store, Ext.Array.merge(me._getGroup(),me._getField(dataIndex, pickerView)));
        Ext.resumeLayouts(true);
    },

    buildField: function () {
        var me = this;

        Ext.create('AppAnest.store.allocationschedule.AllocationSchedule');

        me.columns = Ext.Array.merge(me._getGroup(),me._getField(null, 'vwWeek'));
    }

});