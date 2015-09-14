//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'AppAnest.view.allocationschedule.*',
        'AppAnest.view.person.ContractorUnitSearch',
        'AppAnest.model.allocationschedule.TMP_TurningMonthly',
        'AppAnest.store.allocationschedule.TMP_TurningMonthly'
    ],

    startPublishSchedule: function (btn) {
        var me = this,
            view = me.getView(),
            form = btn.up('window').down('form'),
            params = form.getValues();

        params.action ='setPublishSchedule';

        view.setLoading('Publicando Escala Mensal ...');

        Ext.Ajax.request({
            timeout: (60000 * 10), // 10 minutos
            url: 'business/Class/schema.php',
            params: params,
            success: function(response){
                view.setLoading(false);
                btn.up('window').close();
            }
        });
    },

    onShowDirectorShip: function (win) {
        var me = this,
            param = {},
            view = me.getView(),
            store = Ext.getStore('contractorunit');

        param.limit = 0;
        param.action = 'select';
        param.method = 'selectLike';

        view.setLoading('Carregando escala ...');

        store.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                view.setLoading(false);
            }
        });
    },

    showDirectorShip: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            win = Ext.widget('allocationscheduledirectorship');

        win.show(null, function() {
            win.down('hiddenfield[name=status]').setValue(period.status);
            win.down('hiddenfield[name=periodid]').setValue(period.getValue());
            win.down('textfield[name=period]').setValue(period.getDisplayValue());
        },me);
    },

    showPublishSchedule: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            win = Ext.widget('publishschedule');

        if(period.status == 'P') {
            Ext.Msg.show({
                title:'Publicando Escala!',
                message: 'A escala atual ja esta no status de publicada!',
                buttons: Ext.Msg.CANCEL,
                icon: Ext.Msg.WARNING
            });
        } else {
            win.show(null, function() {
                win.down('hiddenfield[name=status]').setValue(period.status);
                win.down('hiddenfield[name=periodid]').setValue(period.getValue());
                win.down('textfield[name=period]').setValue(period.getDisplayValue());
            },me);

        }
    },

    showFrequencySheet: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            record = period.getSelectedRecord(),
            win = Ext.widget('allocationschedulefrequencysheet');

        win.show(null, function() {
            var dateof = win.down('datefield[name=dateof]'),
                dateto = win.down('datefield[name=dateto]'),
                periodof = record.toDate(record.get('periodof')),
                periodto = record.toDate(record.get('periodto'));

            dateof.setValue(periodof);
            dateto.setValue(periodto);
            dateof.setMinValue(periodof);
            dateto.setMaxValue(periodto);

            win.down('hiddenfield[name=periodid]').setValue(period.getValue());
            win.down('textfield[name=period]').setValue(period.getDisplayValue());
        },me);
    },

    showReportDirectorShip: function (btn) {
        var me = this,
            contractorunitlist = [],
            form = btn.up('window').down('form'),
            grid = form.down('gridpanel'),
            data = form.getValues(),
            list = grid.getSelectionModel().getSelection(),
            url = 'business/Class/Report/DirectorShip.php?',
            qrp = 'periodid={0}&contractorunitlist={1}&status={2}';

        if(list.length) {
            var status = data.status,
                periodid = data.periodid;

            Ext.each(list,function(record, index) {
                contractorunitlist.push(parseInt(record.get('id')));
            },me);

            window.open(Ext.String.format(url + qrp,periodid,Ext.encode(contractorunitlist),status));
        } else {

        }
    },

    showReportSheetFrequency: function (btn) {
        var me = this,
            view = me.getView(),
            form = btn.up('window').down('form'),
            data = form.getValues(),
            period = view.down('schedulingperiodsearch'),
            url = 'business/Class/Report/SheetFrequency.php?',
            qrp = 'periodid={0}&contractorunitid={1}&subunit={2}&subunittext={3}&dateof={4}&dateto={5}&status={2}';

        data.subunittext = form.down('comboenum[name=subunitdescription]').getRawValue();

        if(form.isValid()) {
            var status = data.status,
                periodid = data.periodid,
                contractorunitid = data.contractorunitid,
                subunit = data.subunit,
                dateof = data.dateof,
                dateto = data.dateto;
            window.open(Ext.String.format(url + qrp,periodid,contractorunitid,subunit,data.subunittext,dateof,dateto,status));
        }
    },

    updateAllocationSchedule: function (btn) {
        var me = this,
            view = btn.up('window'),
            form = view.down('form');

        me._success = function (batch, options) {
            var namturalperson = view.down('naturalpersonsearch[name=naturalperson]').getRawValue();
            view.zdata.set(view.dataIndex + 'description',namturalperson);
            view.zdata.commit();
            view.close();
        }

        me.setModuleData('tmp_turningmonthly');
        me.setModuleForm(form);
        me.updateRecord();
    },

    onShowAllocationScheduleEdit: function (view) {
        var me = this;

        view.down('form').loadRecord(view.xdata);

        me.setReadOnlyFields(view.down('form'),'E');
    },

    setReadOnlyFields: function (form, type) {
        var me = this,
            fields = [
                'dutydate',
                'position',
                'contractorunit',
                'shiftdescription',
                'subunitdescription',
                'allocationschemadescription'
            ];

        Ext.each(fields,function (field) {
            form.getForm().findField(field).setReadOnlyColor(true);
        });
    },

    onCellClick: function ( viewTable, td, cellIndex, record, tr, rowIndex, e ) {
        var me = this,
            param = {},
            view = me.getView(),
            dataIndex = viewTable.getColumnManager().getHeaderAtIndex(cellIndex).dataIndex;

        if((record.get(dataIndex) == "...")||(!record.get(dataIndex.replace("description","")))) {
            return false;
        }

        if (e.ctrlKey === true) {
            Ext.Msg.show({
                title:'Removendo Socio agendado!',
                message: 'Confirma a remocao deste socio agendado?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        viewTable.setLoading('Removendo o registro...');
                        Ext.Ajax.request({
                            scope: me,
                            url: viewTable.store.getUrl(),
                            params: {
                                action: 'select',
                                method: 'updateNaruralPerson',
                                query: record.get(dataIndex.replace("description",""))
                            },
                            callback: function(options, success, response) {
                                viewTable.setLoading(false);
                                record.set(dataIndex,'...');
                                record.commit();
                            }
                        });
                    }
                }
            });
        }
    },

    onScheduleCelldDlclick: function (viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var me = this,
            param = {},
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            store = Ext.create('AppAnest.store.allocationschedule.TMP_TurningMonthly'),
            dataIndex = viewTable.getColumnManager().getHeaderAtIndex(cellIndex).dataIndex.replace("description","");

        if(!record.get(dataIndex.replace("description",""))) {
            return false;
        }

        view.setLoading('Carregando edicao da escala ...');

        param = {
            query: record.get(dataIndex),
            action: 'select',
            method: 'selectCode',
            period: period.getValue(),
            dataIndex: dataIndex,
            rows: Ext.encode(record.data)
        };

        store.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                view.setLoading(false);
                Ext.widget('allocationscheduleedit', {
                    xdata: records[0],
                    zdata: record,
                    dataIndex: dataIndex
                }).show();
            }
        });
    },

    startDatePicker: function(picker, date) {
        var me = this;

        picker.setPickerView(picker.getPickerView());
        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());
    },

    onFilterSchedule: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            view = me.getView(),
            store = Ext.getStore('allocationschedule'),
            filter = view.down('radiogroup[name=filter]').getValue();

        store.clearFilter();

        switch(parseInt(filter.filtertype)) {
            case 1:
                store.filter('contractorunit',newValue);
                break;
            case 2:
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
                break;
        }
    },

    getDateFormated: function (date) {
        var stringDate = '{0} de {1} de {2}',
            monthNames = [
                "Janeiro", "Fevereiro", "Março",
                "Abril", "Maio", "Junho", "Julho",
                "Agosto", "Setembro", "Outubro",
                "Novembro", "Dezembro"
            ],
            day = date.getDate(),
            monthIndex = date.getMonth(),
            year = date.getFullYear();

        return Ext.String.format(stringDate,day, monthNames[monthIndex], year);
    },

    selectSchedule: function (pickerView, periodView) {
        var me = this,
            param = {},
            view = me.getView(),
            days = [0,1,2,3,4,5,6],
            grid = view.down('gridpanel'),
            dataIndex = me.getDataIndex(),
            store = Ext.getStore('allocationschedule'),
            period = view.down('schedulingperiodsearch'),
            label = view.down('label[name=labelperiod]');

        param.status = period.status;
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

                var dateOfstr = me.getDateFormated(Ext.Date.parse(periodView.dateOf, "Y-m-d"));
                var dateTostr = me.getDateFormated(Ext.Date.parse(periodView.dateTo, "Y-m-d"));

                label.setText((dateOfstr != dateTostr) ? (dateOfstr +' - '+ dateTostr): dateOfstr);
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
        }

        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());
    },

    onBeforeQuery: function ( queryPlan, eOpts ) {
        var combo = queryPlan.combo,
            store = combo.store;

        store.setParams({
            status: combo.status,
            params: combo.params
        });
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