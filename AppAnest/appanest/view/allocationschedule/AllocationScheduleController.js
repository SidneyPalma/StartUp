//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*'
    ],

    //minDate: new Date("8/01/2015"),// Ext.Date.getFirstDateOfMonth(new Date()),
    //maxDate: new Date("8/31/2015") //Ext.Date.getLastDateOfMonth(new Date()),
    //disabledDates: ['08/19/2014'], //To disable other dates if needed
    //disabledDays: [0,1],
    //handler: 'setPickerView'


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
    },

    onSelectPeriod: function ( combo, record, eOpts ) {
        var me = this,
            view = me.getView(),
            form = view.down('form'),
            picker = view.down('datepicker'),
            periodid = form.down('hiddenfield[name=periodid]');
            periodof = record.stringToDate(record.get('periodof')),
            periodto = record.stringToDate(record.get('periodto'));

        picker.setValue(periodof);

        picker.setMinDate(Ext.Date.getFirstDateOfMonth(periodof));
        picker.setMaxDate(Ext.Date.getLastDateOfMonth(periodto));
    }

});