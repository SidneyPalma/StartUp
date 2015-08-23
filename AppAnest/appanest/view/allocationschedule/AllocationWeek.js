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

    buildField: function () {
        var me = this;

        Ext.create('AppAnest.store.allocationschedule.AllocationSchedule');

        me.columns = [
            {
                cls: 'x-column-header-inner-dark allocationweek-border-left',
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
                cls: 'x-column-header-inner-dark',
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
            }, {
                flex: 1,
                text: 'SEGUNDA-FEIRA',
                dataIndex: 'mondescription'
            }, {
                flex: 1,
                text: 'TERÇA-FEIRA',
                dataIndex: 'tuedescription'
            }, {
                flex: 1,
                text: 'QUARTA-FEIRA',
                dataIndex: 'weddescription'
            }, {
                flex: 1,
                    text: 'QUINTA-FEIRA',
                dataIndex: 'thudescription'
            }, {
                flex: 1,
                text: 'SEXTA-FEIRA',
                dataIndex: 'fridescription'
            }, {
                cls: 'x-column-header-inner-dark',
                flex: 1,
                text: 'SÁBADO',
                dataIndex: 'satdescription'
            }, {
                cls: 'x-column-header-inner-dark allocationweek-border-right',
                flex: 1,
                text: 'DOMINGO',
                dataIndex: 'sundescription'
            }
        ];
    }

});