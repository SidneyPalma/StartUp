//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*'
    ],

    startDatePicker: function(picker, date) {
        console.info(picker.getPickerPeriod());
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


    selectSchedule: function () {
        var me = this,
            param = {},
            view = me.getView(),
            schemamonthly = Ext.getStore('allocationschedule');

        param.action = 'select';
        param.method = 'selectSchedule';

        view.setLoading('Carregando escala ...');

        schemamonthly.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                picker.setPickerView(picker.getPickerView());
                picker.setMinDate(periodof);
                picker.setMaxDate(periodto);
                view.setLoading(false);
            }
        });
    },

    getCardIndex: function (btn) {
        var me = this,
            param = {},
            view = me.getView(),
            picker = view.down('datepicker'),
            period = view.down('periodsearch'),
            record = period.getSelectedRecord(),
            periodof = record.toDate(record.get('periodof')),
            periodto = record.toDate(record.get('periodto')),
            schemamonthly = Ext.getStore('allocationschedule');

        param.action = 'select';
        param.method = 'selectSchedule';

        view.setLoading('Carregando escala ...');

        schemamonthly.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                picker.setPickerView(picker.getPickerView());
                picker.setMinDate(periodof);
                picker.setMaxDate(periodto);
                view.setLoading(false);
            }
        });

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
    },

    onSelectPeriod: function ( combo, record, eOpts ) {
        var me = this,
            param = {},
            view = me.getView(),
            form = view.down('form'),
            picker = view.down('datepicker'),
            schedule = view.down('container[name=schedule]'),
            periodof = record.toDate(record.get('periodof')),
            periodto = record.toDate(record.get('periodto')),
            periodid = form.down('hiddenfield[name=periodid]'),
            schemamonthly = Ext.getStore('allocationschedule');

        param.action = 'select';
        param.method = 'selectSchedule';

        view.setLoading('Carregando escala ...');

        schemamonthly.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                picker.setValue(periodof);
                schedule.setDisabled(false);
                picker.setPickerView(picker.getPickerView());
                picker.setMinDate(periodof);
                picker.setMaxDate(periodto);
                view.setLoading(false);
            }
        });
    }

});