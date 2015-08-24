//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*'
    ],

    startDatePicker: function(picker, date) {
        var me = this;

        picker.setPickerView(picker.getPickerView());
        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());
    },

    onFilterContractorUnit: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            store = Ext.getStore('allocationschedule');

        store.clearFilter();
        store.filter('contractorunit',newValue);
    },

    onFilterNaturalPerson: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            store = Ext.getStore('allocationschedule');

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
            period = view.down('periodsearch'),
            schemamonthly = Ext.getStore('allocationschedule');

        param.action = 'select';
        param.method = 'selectSchedule';
        param.pickerView = pickerView;
        param.dateOf = periodView.dateOf;
        param.dateTo = periodView.dateTo;
        param.period = period.getValue();

        view.setLoading('Carregando escala ...');

        schemamonthly.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                view.setLoading(false);
            }
        });
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