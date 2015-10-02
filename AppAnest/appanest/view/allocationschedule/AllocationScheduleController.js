//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschedule',

    requires: [
        'Smart.util.Message',
        'AppAnest.view.person.*',
        'AppAnest.view.allocationschedule.*'
    ],


    config: {
        control: {
            'allocationschedulescore form[name=schedulingmonthlyscoreR] naturalpersonsearch': {
                select: 'onSelectNaturalPerson'
            }
        }
    },

    onFilterScore: function (field, newValue, oldValue, eOpts) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=selectscore]'),
            layout = form.getLayout();

        layout.setActiveItem(newValue.filterscore);
        layout.getActiveItem().down('gridpanel').store.load();
    },

    onClosedScore: function () {
        var me = this;
        me.onChangeMonthlyScore(false);
    },

    onUpdateScore: function (btn) {
        var me = this,
            view = me.getView(),
            data = btn.up('window').xdata,
            //btn.up('container[name=containersubmit]'),
            form = view.down('form'),
            grid = view.down('gridpanel'),
            schedulingmonthlypartnersid = form.down('hiddenfield[name=schedulingmonthlypartnersid]');

        schedulingmonthlypartnersid.setValue(data.get('id'));

        me._success = function (form, action) {
            form.reset();
            grid.store.load();
        }

        me._failure = function (form, action) {
            grid.store.rejectChanges();
        }

        me.setModuleData(grid.store);
        me.setModuleForm(form);
        me.updateModule();
    },

    onInsertScore: function (btn) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=updatescore]'),
            card = form.down('form[name=selectscore]');

        card.reset();
        card.getLayout().getActiveItem().down('gridpanel').getSelectionModel().deselectAll();
    },

    onSelectShiftHours: function (combo, record, eOpts) {
        var view = combo.up('window');

        view.xdata.set('shifthours',combo.getValue());

        view.xdata.store.sync({
            success: function (batch, options) {
                view.xdata.commit();
            }
        });
    },

    onSelectNaturalPerson: function (combo, record, eOpts) {
        var me = this;
        me.onUpdateScore(combo);
    },

    onCellClickScore: function ( viewTable, td, cellIndex, record, tr, rowIndex, e ) {
        var dataIndex = viewTable.getColumnManager().getHeaderAtIndex(cellIndex).dataIndex,
            warning = 'O Socio sera removido da presente lista!';

        if(dataIndex != '') {
            return false;
        }

        Smart.Msg.question("Confirma a remocao deste registro? <br/> <br/>" + warning, function(btn) {
            if (btn === 'yes') {
                viewTable.store.remove(record);
                viewTable.store.sync({
                    success: function (batch, options) {
                        viewTable.store.load();
                        viewTable.up('container[name=containersubmit]').down('form').reset();
                    }
                });
            }
        });
    },

    onSelectScoreR: function (rowModel, record, index, eOpts) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=schedulingmonthlyscoreR]');
        form.loadRecord(record);
    },

    onSelectScoreP: function (rowModel, record, index, eOpts) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=schedulingmonthlyscoreP]');
        form.loadRecord(record);
    },

    startPublishSchedule: function (btn) {
        var me = this,
            view = me.getView(),
            form = btn.up('window').down('form'),
            params = form.getValues(),
            warning = 'Todos os dados do processsamento anterior serao perdidos!';

        params.action ='select';
        params.method ='setPublishSchedule';

        Smart.Msg.question("Confirma a publicacao desta escala? <br/> <br/>" + warning, function(btn) {
            if (btn === 'yes') {

                view.setLoading('Publicando Escala Mensal ...');

                Ext.Ajax.request({
                    timeout: (60000 * 10), // 10 minutos
                    url: 'business/Class/schedulingmonthlypartners.php',
                    params: params,
                    success: function(response){
                        view.setLoading(false);
                        btn.up('window').close();
                    }
                });
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

    startScheduleScore: function (btn) {
        var me = this,
            params = {},
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            warning = 'A escala estara habilitada para Contagem somente apos esta confirmacao!';

        if(status != 'P') {
            Ext.Msg.show({
                title:'Gerando Contagem!',
                message: 'A escala atual nao esta no status de publicada!',
                buttons: Ext.Msg.CANCEL,
                icon: Ext.Msg.WARNING
            });
        } else {
            params.action ='select';
            params.method ='startScheduleScore';
            params.periodid = period.getValue();

            Smart.Msg.question("Confirma o processamento da Contagem desta escala? <br/> <br/>" + warning, function(btn) {
                if (btn === 'yes') {

                    view.setLoading('Gerando Contagem da Escala Mensal ...');

                    Ext.Ajax.request({
                        url: 'business/Class/schedulingmonthlypartners.php',
                        params: params,
                        success: function(response){
                            view.setLoading(false);
                            view.down('gridpanel').status = 'C';
                            period.foundRecord().set('status','C');
                            view.down('button[name=statusP]').setDisabled(true);
                            view.down('button[name=statusC]').setDisabled(true);
                            view.down('button[name=statusE]').setDisabled(false);
                            Ext.getStore('allocationschedule').load();
                        }
                    });
                }
            });
        }
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

    showselectSchedule: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            record = period.getSelectedRecord();

        window.open('business/Class/Report/Schedule.php?action=selectSchedule&period='+record.get('id'));
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

    insertAllocationSchedule: function (btn) {
        var me = this,
            view = btn.up('window'),
            form = view.down('form'),
            status = view.down('hiddenfield[name=status]').getValue(),
            store = (status == 'A') ? Ext.create('AppAnest.store.allocationschedule.TMP_TurningMonthly') : Ext.create('AppAnest.store.allocationschedule.SchedulingMonthlyPartners');

        me._success = function (batch, options) {
            view.close();
            Ext.getStore('allocationschedule').load();
        }

        me.setModuleData(store);
        me.setModuleForm(form);
        me.updateModule();
    },

    onShowAllocationScheduleEdit: function (view) {
        var me = this,
            form = view.down('form'),
            fields = [
                'dutydate',
                'position',
                'contractorunit',
                'shiftdescription',
                'subunitdescription'
            ];

        form.loadRecord(view.xdata);

        Ext.each(fields,function (field) {
            form.getForm().findField(field).setReadOnlyColor(true);
        });

        form.down('hiddenfield[name=releasetype]').setValue('M');
    },

    onShowAllocationScheduleScore: function (view) {
        var me = this,
            form = view.down('form'),
            fields = [
                'dutydate',
                'position',
                'naturalperson',
                'contractorunit',
                'shiftdescription',
                'subunitdescription',
                'allocationschemadescription'
            ];

        form.loadRecord(view.xdata);

        Ext.each(fields,function (field) {
            form.getForm().findField(field).setReadOnlyColor(true);
        });
    },

    onShowAllocationScheduleNew: function (view) {
        var me = this,
            form = view.down('form'),
            fields = [
                'position',
                'contractorunit'
            ];

        form.loadRecord(view.xdata);

        Ext.each(fields,function (field) {
            form.getForm().findField(field).setReadOnlyColor(true);
        });

        form.down('hiddenfield[name=id]').setValue(null);
        form.down('hiddenfield[name=releasetype]').setValue('M');

    },

    onBeforeItemKeyDown: function ( rowModel, record, index, eOpts ) {
        var me = this;

        me.onChangeMonthlyScore(false);
    },

    onCellClick: function ( viewTable, td, cellIndex, record, tr, rowIndex, e ) {
        var me = this,
            param = {},
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            dataIndex = viewTable.getColumnManager().getHeaderAtIndex(cellIndex).dataIndex;

        if(status == 'P') {
            return false;
        }

        if((cellIndex < 2) && (cellIndex != 0)) {
            return false;
        }

        if((record.get(dataIndex) == "...")||(!record.get(dataIndex.replace("description","")))) {
            return false;
        }

        if (e.ctrlKey === true) {

            if(cellIndex != 0) {
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
                                url: 'business/Class/tmp_turningmonthly.php',
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
            } else {
                if(parseInt(record.get('bordertop')) == 1) {
                    Ext.widget('allocationschedulenew', {
                        xdata: record,
                        dataIndex: dataIndex
                    }).show(null, function() {
                        this.down('hiddenfield[name=status]').setValue(status);
                        this.down('datefield[name=dutydate]').setMinValue(period.foundRecord().get('periodof'));
                        this.down('datefield[name=dutydate]').setMaxValue(period.foundRecord().get('periodto'));
                    });
                }
            }

        }
    },

    onCellKeyDown: function ( viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var me = this;

        if (e.getKey() === e.ENTER) {
            me.onScheduleCelldDlclick(viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts);
        }
    },

    onScheduleCelldDlclick: function (viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var me = this,
            param = {},
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            fieldName = viewTable.getColumnManager().getHeaderAtIndex(cellIndex).dataIndex,
            dataIndex = fieldName.replace("description","");

        me.onChangeMonthlyScore(false);

        if(cellIndex < 2) {
            return false;
        }

        if(!record.get(dataIndex.replace("description",""))) {
            return false;
        }

        if(status == 'C') {

            if(record.get(fieldName) == '...') {
                return false;
            }

            view.setLoading('Carregando contagem da escala ...');

            param = {
                query: record.get(dataIndex),
                action: 'select',
                method: 'selectCode',
                period: period.getValue(),
                dataIndex: dataIndex,
                rows: Ext.encode(record.data)
            };

            var storePartners = Ext.create('AppAnest.store.allocationschedule.SchedulingMonthlyPartners');

            storePartners.setParams(param).load({
                scope: me,
                callback: function(records, operation, success) {
                    view.setLoading(false);
                    //Ext.widget('allocationschedulescore', {
                    //    xdata: records[0],
                    //    zdata: record,
                    //    dataIndex: dataIndex
                    //}).show(null,function() {
                        me.onChangeMonthlyScore(true);
                        var storeR = view.down('gridpanel[name=schedulingmonthlyscoreR]').store;
                        var storeP = view.down('gridpanel[name=schedulingmonthlyscoreP]').store;
                        view.down('form[name=updatescore]').zdata = record;
                        view.down('form[name=updatescore]').xdata = records[0];
                        param.scoretype = 'R';
                        storeR.setParams(param).load();
                        param.scoretype = 'P';
                        storeP.setParams(param).load();
                    //});
                }
            });
        }

        if(status == 'A') {
            view.setLoading('Carregando edicao da escala ...');

            param = {
                query: record.get(dataIndex),
                action: 'select',
                method: 'selectCode',
                period: period.getValue(),
                dataIndex: dataIndex,
                rows: Ext.encode(record.data)
            };

            var storeTurning = Ext.create('AppAnest.store.allocationschedule.TMP_TurningMonthly');

            storeTurning.setParams(param).load({
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
        }
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



    onChangeMonthlyScore: function ( newValue ) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=updatescore]'),
            bbar = view.down('toolbar[name=updatescore]'),
            changestatus = view.down('segmentedbutton[name=changestatus]');

        form.reset();

        if(newValue) {
            form.show();
            bbar.show();
            changestatus.hide();
        } else {
            form.hide();
            bbar.hide();
            form.reset();
            changestatus.show();
        }
    },

    selectSchedule: function (pickerView, periodView) {
        var me = this,
            param = {},
            view = me.getView(),
            days = [0,1,2,3,4,5,6],
            dataIndex = me.getDataIndex(),
            grid = view.down('allocationscheduleweek'),
            store = Ext.getStore('allocationschedule'),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            label = view.down('label[name=labelperiod]');

        grid.status = status;

        param.status = period.status;
        param.action = 'select';
        param.method = 'selectSchedule';
        param.pickerView = pickerView;
        param.dateOf = periodView.dateOf;
        param.dateTo = periodView.dateTo;
        param.period = period.getValue();

        me.onChangeMonthlyScore(false);

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

                Ext.suspendLayouts();
                grid.getView().setScrollY(3000, true);
                grid.getView().setScrollY(0, true);
                Ext.resumeLayouts(true);

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
            status = record.get('status'),
            picker = view.down('datepicker'),
            periodof = record.toDate(record.get('periodof')),
            periodto = record.toDate(record.get('periodto')),
            schedule = view.down('container[name=schedule]'),
            buttonP = view.down('button[name=statusP]'),
            buttonC = view.down('button[name=statusC]'),
            buttonE = view.down('button[name=statusE]');

        picker.setValue(periodof);
        picker.setMinDate(periodof);
        picker.setMaxDate(periodto);
        schedule.setDisabled(false);

        picker.setPickerView(picker.getPickerView());
        me.selectSchedule(picker.getPickerView(), picker.getPickerPeriod());

        buttonP.setDisabled(true);
        buttonC.setDisabled(true);
        buttonE.setDisabled(true);

        if(status == 'A') buttonP.setDisabled(false);
        if(status == 'P') buttonC.setDisabled(false);
        if(status == 'C') buttonE.setDisabled(false);

    }

});