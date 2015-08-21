//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*'
    ],

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
            param = {},
            view = me.getView(),
            form = view.down('form'),
            picker = view.down('datepicker'),
            periodof = record.toDate(record.get('periodof')),
            periodto = record.toDate(record.get('periodto')),
            periodid = form.down('hiddenfield[name=periodid]'),
            schemamonthly = Ext.getStore('allocationschemamonthly');

        param.allocationschemaid = 5;
        param.action = 'select';
        param.method = 'selectWeek';

        schemamonthly.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                picker.setValue(periodof);
                picker.setMinDate(Ext.Date.getFirstDateOfMonth(periodof));
                picker.setMaxDate(Ext.Date.getLastDateOfMonth(periodto));

                Ext.Ajax.request({
                    timeout: (60000 * 10), // 10 minutos
                    url: 'business/Class/schedulingmonthlypartners.php',
                    params: {
                        action: 'select',
                        method: 'selectSchedule'
                        //periodid: periodsearch.getValue()
                    },
                    success: function(response){
                    }
                });
            }
        });
    }

});