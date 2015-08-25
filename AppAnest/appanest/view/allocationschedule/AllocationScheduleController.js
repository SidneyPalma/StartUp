//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*'
    ],

    onScheduleCelldDlclick: function (viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        console.warn(viewTable.getColumnManager().getHeaderAtIndex(cellIndex).dataIndex);
    },

    startDatePicker: function(picker, date) {
        var me = this;

        picker.setPickerView(picker.getPickerView());
        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());
    },

    onFilterContractorUnit: function ( field, newValue, oldValue, eOpts ) {
        var store = Ext.getStore('allocationschedule');

        store.clearFilter();
        store.filter('contractorunit',newValue);
    },

    onFilterNaturalPerson: function ( field, newValue, oldValue, eOpts ) {
        var store = Ext.getStore('allocationschedule');

        store.clearFilter();
        store.filterBy(
            function(record){
                var filter = record.get('mondescription').toLowerCase() + " " +
                             record.get('tuedescription').toLowerCase() + " " +
                             record.get('weddescription').toLowerCase() + " " +
                             record.get('thudescription').toLowerCase() + " " +
                             record.get('fridescription').toLowerCase() + " " +
                             record.get('satdescription').toLowerCase() + " " +
                             record.get('sundescription').toLowerCase();

                if (filter.indexOf(newValue.toLowerCase()) != -1) return record;
            }
        );
    },

    selectSchedule: function (pickerView, periodView) {
        var me = this,
            param = {},
            view = me.getView(),
            grid = view.down('gridpanel'),
            dataIndex = me.getDataIndex(),
            period = view.down('periodsearch'),
            store = Ext.getStore('allocationschedule');

        param.action = 'select';
        param.method = 'selectSchedule';
        param.pickerView = pickerView;
        param.dateOf = periodView.dateOf;
        param.dateTo = periodView.dateTo;
        param.period = period.getValue();

        view.setLoading('Carregando escala ...');

        store.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                view.setLoading(false);
                grid.buildModel(dataIndex,pickerView);
            }
        });
    },

    getDataIndex: function () {
        var me = this,
            dataIndex = null,
            view = me.getView(),
            picker = view.down('datepicker'),
            weekdata = [
                'sundescription',
                'mondescription',
                'tuedescription',
                'weddescription',
                'thudescription',
                'fridescription',
                'satdescription'
            ];

        if(picker.getPickerView() == 'vwDay') {
            dataIndex = weekdata[picker.getValue().getDay()];
        }

        return dataIndex;
    },

    getCardIndex: function (btn) {
        var me = this,
            view = me.getView(),
            picker = view.down('datepicker');

        switch (btn.cardIndex) {
            case 0:
                picker.setPickerView('vwDay');
                break;
            case 1:
                picker.setPickerView('vwWeek');
                break;
            case 2:
                picker.setPickerView('vwMonth');
                break;
        }

        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());
    },

    onSelectPeriod: function ( combo, record, eOpts ) {
        var me = this,
            view = me.getView(),
            picker = view.down('datepicker'),
            periodof = record.toDate(record.get('periodof')),
            periodto = record.toDate(record.get('periodto')),
            schedule = view.down('container[name=schedule]');

        picker.setValue(periodof);
        picker.setMinDate(periodof);
        picker.setMaxDate(periodto);
        schedule.setDisabled(false);

        picker.setPickerView(picker.getPickerView());
        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());
    }

});