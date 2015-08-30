//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*',
        'AppAnest.view.person.ContractorUnitSearch'
    ],

    showCalendar: function () {
        window.open('business/Class/Report/ScheduleContractUinit.php');
    },

    showReport: function () {
        Ext.widget('allocationschedulereport').show();
    },

    showReportSheetFrequency: function (btn) {
        var form = btn.up('window').down('form'),
            data = form.getValues(),
            url = 'business/Class/Report/SheetFrequency.php?',
            qrp = 'periodid={0}&contractorunitid={1}&subunit={2}&subunittext={3}&dateof={4}&dateto={5}';

        if(form.isValid()) {
            var periodid = data.periodid,
                contractorunitid = data.contractorunitid,
                subunit = data.subunit.substring(0,1),
                dateof = data.dateof,
                dateto = data.dateto;
            window.open(Ext.String.format(url + qrp,periodid,contractorunitid,subunit,data.subunit,dateof,dateto));
        }
    },

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
            days = [0,1,2,3,4,5,6],
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
                var columns = grid.getColumnManager().getColumns(),
                    dateOf = Ext.Date.parse(periodView.dateOf, "Y-m-d");

                if(pickerView == 'vwDay') {
                    columns[2].setText(grid._columnText[columns[2].dataIndex] + '<br/><span style="font-size: 18px; line-height: 24px;">' + dateOf.getDate() + '</span>');
                } else {
                    var d = 0;
                    for (i = 2; i < days.length +2; i++) {
                        dateOf = Ext.Date.parse(periodView.dateOf, "Y-m-d");
                        dateOf.setDate(dateOf.getDate() + d);
                        columns[i].setText(grid._columnText[columns[i].dataIndex] + '<br/><span style="font-size: 18px; line-height: 24px;">' + dateOf.getDate() + '</span>');
                        d++;
                    }
                }
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

    onSelectPeriodReport: function ( combo, record, eOpts ) {
        var form = combo.up('form'),
            dateof = form.down('datefield[name=dateof]'),
            dateto = form.down('datefield[name=dateto]'),
            periodof = record.toDate(record.get('periodof')),
            periodto = record.toDate(record.get('periodto'));

        dateof.setValue(periodof);
        dateto.setValue(periodto);
        dateof.setMinValue(periodof);
        dateto.setMaxValue(periodto);
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