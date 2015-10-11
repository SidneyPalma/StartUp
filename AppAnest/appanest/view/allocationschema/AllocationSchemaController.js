//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchemaController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschema',

    requires: [
        'Smart.util.Message',
        'AppAnest.view.allocationschema.*'
    ],

    init: function() {
        this.listen({
            store: {
                '#allocationschemamap': {
                    beforeload: 'onLoadAllocationSchemaWeek'
                }
            }
        });
    },

    onLoadAllocationSchemaWeek: function ( store, operation, eOpts ) {
        store.clearFilter();
        store.filter('weekday',/(^mon)|(^tue)|(^wed)|(^thu)|(^fri)/);
    },

    onChangeSchemaMonthlyType: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            param = {},
            view = me.getView(),
            schema = view.down('container[name=schema]'),
            form = view.down('form[name=schemamonthly]'),
            id = form.down('hiddenfield[name=id]').getValue(),
            schemamap = view.down('gridpanel[name=schemamonthlymap]'),
            allocationschemap = me.lookupReference('allocationschemap'),
            schemaweekday = view.down('gridpanel[name=schemaweekday]');

        schema.getLayout().setActiveItem(newValue.type);
        allocationschemap.getLayout().setActiveItem(newValue.type);

        view.down('schedulingperiodsearch').setReadOnlyColor(newValue.type == 1);

        switch (newValue.type) {
            case 0:
                break;
            case 1:
                schemaweekday.store.removeAll();
                view.down('numberfield[name=weekmax]').reset();
                view.down('numberfield[name=weekold]').reset();
                view.down('numberfield[name=weeknew]').reset();

                Ext.suspendLayouts();
                schemaweekday.reconfigure(schemaweekday.store, []);
                Ext.resumeLayouts(true);

                param.action = 'select';
                param.method = 'selectCode';
                param.allocationschemaid = id;
                schemamap.getStore().setParams(param).load({
                    scope: me,
                    callback: function(records, operation, success) {
                        schemamap.getSelectionModel().select(0);
                    }
                });
                break;
        }
    },

    onChangeFilterMonthly: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            store = Ext.getStore('allocationschemamonthly');

        store.clearFilter();
        store.filter('contractorunit',newValue);

        me.onSearchAlter(field, newValue, oldValue, eOpts);
    },

    onChangeFilterWeekly: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            store = Ext.getStore('allocationschemaweekday');

        store.clearFilter();
        store.filter('contractorunit',newValue);

        me.onSearchAlter(field, newValue, oldValue, eOpts);
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
            param = {},
            view = me.getView(),
            label = view.down('label[name=labelperiod]'),
            schema = view.down('container[name=schema]'),
            form = view.down('form[name=schemamonthly]'),
            store = Ext.getStore('allocationschemamonthly'),
            periodid = form.down('hiddenfield[name=schedulingperiodid]'),
            allocationschema = Ext.getStore('allocationschema'),
            allocationschemap = me.lookupReference('allocationschemap');

        param.query = record.get('id');
        param.action = 'select';
        param.method = 'selectCode';

        form.reset();
        store.removeAll();

        view.down('radiogroup').down('#type1').setDisabled(true);

        allocationschema.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                var schemaweek;

                if(records.length && success == true) {
                    var rec = records[0];
                    schemaweek = rec.get('schemaweek');
                    form.loadRecord(rec);

                    view.down('radiogroup').down('#type1').setDisabled(!((schemaweek) && (schemaweek.length != 0)));
                } else {
                    periodid.setValue(record.get('id'));
                }

                schema.setDisabled(false);

                param.action = 'select';
                param.method = 'selectWeek';
                param.allocationschemaid = rec.get('id');
                view.setLoading('Carregando esquema ...');

                store.setParams(param).load({
                    scope: me,
                    callback: function(records, operation, success) {
                        view.setLoading(false);
                        if(records.length && success == true) {
                            var grid = view.down('allocationschemaweek');
                            Ext.suspendLayouts();
                            grid.getView().setScrollY(3000, true);
                            grid.getView().setScrollY(0, true);
                            Ext.resumeLayouts(true);
                        }
                    }
                });
            }
        });

        var dateOfstr = me.getDateFormated(Ext.Date.parse(record.get('periodof'), "d/m/Y"));
        var dateTostr = me.getDateFormated(Ext.Date.parse(record.get('periodto'), "d/m/Y"));

        label.setText((dateOfstr != dateTostr) ? (dateOfstr +' - '+ dateTostr): dateOfstr);
    },

    onUpdateSchemaSetting: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            record = period.foundRecord();

        Ext.widget('contractorunitschema').show(null,function() {
            this.xdata = record;
            this.down('hiddenfield[name=schedulingperiodid]').setValue(record.get('id'));
        });
    },

    onCreateSchemaMonthly: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            record = period.foundRecord(),
            id = view.down('hiddenfield[name=id]').getValue(),
            warning = 'Todos os dados do processsamento anterior serao perdidos!';

        if(record.get('status') != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        Smart.Msg.question("Confirma o processamento desta escala? <br/> <br/>" + warning, function(btn) {
            if (btn === 'yes') {

                view.setLoading('Processando Escala Mensal ...');

                Ext.Ajax.request({
                    timeout: (60000 * 10), // 10 minutos
                    url: 'business/Class/schema.php',
                    params: {
                        action: 'selectTurningSchema',
                        periodid: period.getValue()
                    },
                    success: function(response){
                        view.setLoading(false);
                    }
                });

            }
        });
    },

    onUpdateSchemaMonthly: function () {
        var me = this,
            list = [],
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            form = view.down('form[name=schemamonthly]'),
            schema = Ext.getStore('allocationschema'),
            schemamonthly = Ext.getStore('allocationschemamonthly'),
            information = 'Este planejamento sera usado no processamento da escala!';

        if(status != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        Smart.Msg.question("Confirma salvar o planejamento desta escala? <br/> <br/>" + information, function(btn) {
            if (btn === 'yes') {

                schemamonthly.clearFilter();
                schemamonthly.each(function(record,index) {
                    list.push(record.data);
                },me);

                form.down('hiddenfield[name=schemaweek]').setValue(Ext.encode(list));

                me.setModuleData(schema);
                me.setModuleForm(form);

                me._success = function (frm, action) {
                    var record = frm.getRecord(),
                        result = schema.findRecord('id',record.get('id'));

                    view.down('radiogroup').down('#type1').setDisabled(false);
                    form.down('hiddenfield[name=id]').setValue(record.get('id'));
                    result.set('schemaweek',record.get('schemaweek'));
                    result.commit();
                }

                me._failure = function (frm, action) {
                }

                me.updateModule();

            }
        });
    },

    onUpdateSchemaWeekDay: function () {
        var me = this,
            list = [],
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            grid = view.down('gridpanel[name=schemamonthlymap]'),
            store = Ext.getStore('allocationschemaweekday'),
            information = 'Este planejamento sera usado no processamento da escala!';

        if(status != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        if(store.getCount() == 0) {
            Smart.Msg.attention("Nao ha um MAPA selecionado para salvar no planejamento!");
            return false;
        }

        if(view.down('form').isValid() === false) {
            Smart.Msg.warning(Smart.Msg.invalidFields());
            return false;
        }

        Smart.Msg.question("Confirma salvar o planejamento deste MAPA? <br/> <br/>" + information, function(btn) {
            if (btn === 'yes') {
                var weekmax = view.down('numberfield[name=weekmax]'),
                    weekold = view.down('numberfield[name=weekold]'),
                    weeknew = view.down('numberfield[name=weeknew]');

                store.clearFilter();

                if ( store.getCount() == 0) {
                    return false;
                }

                store.each(function(record,index) {
                    list.push(record.data);
                },me);

                grid.store.each(function(model,index) {
                    if (model.get('isselected')) {
                        model.set('schemamap',Ext.encode(list));
                        model.set('id',( model.get('id').length == 0 ? '' : model.get('id') ));

                        model.set('weekmax',weekmax.getValue());
                        model.set('weekold',weekold.getValue());
                        model.set('weeknew',weeknew.getValue());

                        model.store.sync({
                            success: function (batch, options) {
                                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                                if((options.operations.create)&&(resultSet !== null) && (resultSet.success)) {
                                    var opr = batch.getOperations()[0],
                                        rec = opr.getRecords()[0];
                                    model.set('id',rec.get('id'));
                                    model.commit();
                                }
                            }
                        });
                    }
                },me);

            }
        });

    },

    selectAllocationSchema: function(combo, record, eOpts) {
        var me = this,
            view = me.getView(),
            fieldName = combo.updateField,
            sm = view.down('gridpanel[name=schemamonthly]').getSelectionModel(),
            rc = sm.getSelection()[0];

        rc.set(fieldName,record.get('allocationschema'));
        rc.set(fieldName + 'description',record.get('allocationschemadescription'));
        rc.commit();
    },

    onAllocationSchemaBeforeEdit: function (editor, context, eOpts) {
        var me = this,
            view = me.getView(),
            fixed = [2, 3, 4, 5, 6, 7, 8],
            items = editor.getEditor().items,
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            field = context.field.replace('description',''),
            lists = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        if(status != 'A') return false;

        Ext.each(fixed, function (value, index) {
            var weekday = parseInt(context.record.get(lists[index]));
            items.getAt(value).setDisabled(weekday == 0);
        });

        return parseInt(context.record.get(field)) !== 0;
    },

    onDeleteMonthly: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            id = view.down('hiddenfield[name=id]').getValue(),
            schema = Ext.getStore('allocationschema'),
            record = schema.findRecord('id',id),
            schemamonthly = Ext.getStore('allocationschemamonthly'),
            warning = 'Todos os MAPAS criados serao perdidos!';

        if(status != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        Smart.Msg.question("Confirma limpar o planejamento da escala? <br/> <br/>" + warning, function(btn) {
            if (btn === 'yes') {

                if(record) {
                    record.set('schemaweek',null);
                    record.store.sync({
                        success: function (batch, options) {
                            record.commit();
                            schemamonthly.load();
                            view.down('radiogroup').down('#type1').setDisabled(true);
                        }
                    });
                }

            }
        });

    },

    onDeleteWeekDay: function () {
        var me = this,
            view = me.getView(),
            period = view.down('schedulingperiodsearch'),
            status = period.foundRecord().get('status'),
            grid = view.down('gridpanel[name=schemamonthlymap]'),
            weekdayStore = view.down('gridpanel[name=schemaweekday]').getStore(),
            warning = 'Todos os dados criados deste MAPA serao perdidos!';

        if(status != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        Smart.Msg.question("Confirma limpar o planejamento do MAPA? <br/> <br/>" + warning, function(btn) {
            if (btn === 'yes') {

                grid.store.each(function(model,index) {
                    if ((model.get('isselected'))&&(model.get('id').length != 0)) {
                        model.set('schemamap','');
                        model.store.sync({
                            success: function (batch, options) {
                                weekdayStore.removeAll();
                                model.set('isselected',false);
                                model.commit();
                            }
                        });
                    }
                },me);

            }
        });

    },

    onCellDblClickWeekDay: function ( viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var me = this,
            param = {},
            view = me.getView(),
            grid = view.down('gridpanel[name=schemamonthlymap]'),
            model = grid.getSelectionModel().getSelection()[0],
            schemaweekday = view.down('gridpanel[name=schemaweekday]'),
            highlights = view.down('hiddenfield[name=highlights]'),
            schemaweek = view.down('hiddenfield[name=schemaweek]'),
            store = schemaweekday.getStore();

        record.store.each(function(rec,index) {
            rec.set('isselected',false);
        },me);

        record.set('isselected',true);

        if(cellIndex == 1) {
            param.action = 'select';
            param.method = 'selectWeekDay';
            param.weekday = model.get('weekday');
            param.positioncute = record.get('position');
            param.id = view.down('hiddenfield[name=id]').getValue();

            store.setParams(param).load({
                scope: me,
                callback: function(records, operation, success) {
                    me.setWeekDayData(schemaweekday);
                }
            });
        }

        if(cellIndex > 1) {
            if(schemaweek.getValue().length != 0) {
                var week = 'week' + Ext.String.leftPad(cellIndex-1, 2, '0');
                highlights.setValue(record.get(week));
                me.setWeekDayData(schemaweekday);
            }
        }
    },

    setWeekDayData: function (schemaweekday) {
        var me = this,
            view = me.getView(),
            store = schemaweekday.getStore(),
            grid = view.down('gridpanel[name=schemamonthlymap]'),
            model = grid.getSelectionModel().getSelection()[0],
            highlights = view.down('hiddenfield[name=highlights]').getValue(),
            getFields = function () {
                var fields = [], i,
                    dutyamount = store.getCount(),
                    weekold = parseInt(model.get('weekold')),
                    weeknew = parseInt(model.get('weeknew'));

                for (i = 1; i <= dutyamount; i++) {
                    fields.push({
                        text: i,
                        align: 'center',
                        dataIndex: 'week' + Ext.String.leftPad(i, 2, '0'),
                        width: 30,
                        renderer: function (value, meta, rec, rowIndex, colIndex) {
                            var color = parseInt(rec.get('position')) % 2 == 0,
                                metaStyle = (color) ? '' : 'background-color: rgba(242, 243, 235, .9)';

                            metaStyle = (parseInt(rowIndex) == parseInt(rec.get('positioncute'))-1) ? 'background-color: rgba(254, 189, 98, .5)' : metaStyle;

                            if((parseInt(colIndex)-1) == weekold) {
                                metaStyle = 'background-color: rgba(205, 179, 128, 0.4);';
                            }

                            if((parseInt(colIndex)-1) == weeknew) {
                                metaStyle = 'background-color: rgba(205, 179, 128, 0.8);';
                            }

                            meta.style = metaStyle;

                            if(parseInt(value) == parseInt(highlights)) {
                                meta.style = 'background-color: rgb(189, 252, 0);';
                            }

                            return value;
                        }
                    });
                }

                return fields;
            };

        view.down('numberfield[name=weekmax]').setValue(store.getCount());
        view.down('numberfield[name=weeknew]').setMaxValue(store.getCount());

        Ext.suspendLayouts();

        schemaweekday.reconfigure(store, [
            {
                cls: 'dark',
                text: '<a style="font-size: 18px; font-family: Monda;">' + 'U N I D A D E S' + '</a>',
                align: 'center',
                columns: [
                    {
                        align: 'left',
                        text: 'Unidade',
                        dataIndex: 'contractorunit',
                        width: 160,
                        renderer: function (value, meta, record, rowIndex, colIndex, store) {
                            var first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                                color = parseInt(record.get('position')) % 2 == 0,
                                metaStyle = (color) ? 'background-color: rgba(84, 86, 62, .35);' : 'background-color: rgba(84, 86, 62, .2);';

                            metaStyle += 'font-family: Monda; border-left: 1px solid #cecece;';
                            meta.style = metaStyle;

                            if (first) {
                                var i = rowIndex + 1;
                                while (i < store.getCount() && value === store.getAt(i).get('contractorunit')) {
                                    i++;
                                }
                            }

                            return first ? value : '';
                        }
                    }, {
                        text: '##',
                        align: 'center',
                        dataIndex: 'position',
                        width: 50,
                        renderer: function (value, meta, record, rowIndex, colIndex, store) {
                            var color = parseInt(record.get('position')) % 2 == 0,
                                first = !rowIndex || value !== store.getAt(rowIndex - 1).get('position'),
                                style = (parseInt(rowIndex) == parseInt(record.get('positioncute'))-1) ? '<span class="position border-radius" onclick="">{0}</span>' : '<span class="position">{0}</span>';

                            meta.style = (color) ? 'font-family: Monda; background-color: rgba(248, 202, 0, .5);' : 'font-family: Monda; background-color: rgba(248, 202, 0, .9);';

                            if (first) {
                                var i = rowIndex + 1;
                                while (i < store.getCount() && value === store.getAt(i).get('position')) {
                                    i++;
                                }
                            }

                            meta.style = (parseInt(rowIndex) == parseInt(record.get('positioncute'))-1) ? 'font-family: Monda; background-color: rgba(248, 202, 0, .5)' : meta.style;

                            return first ? Ext.String.format(style,value) : '';
                        }
                    }
                ]
            }, {
                cls: 'ligth',
                align: 'center',
                text: '<a style="font-size: 18px; font-family: Monda;">' + 'S E M A N A S' + '</a>',
                columns: getFields()
            }
        ]);

        Ext.resumeLayouts(true);
    },

    onCellClick: function ( viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {

        if((cellIndex == 1)&&(record.get('isselected') == true)) {
            window.open('business/Class/allocationschemamap.php?action=select&method=getWorkSheetWeekDay&id='+record.get('id'));
        }

    },

    onCellDblClick: function ( viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var me = this,
            view = me.getView(),
            fm = view.down('form[name=schemaweekday]'),
            param = fm.getValues(),
            schemamap = record.get('schemamap'),
            schemaweekday = view.down('gridpanel[name=schemaweekday]'),
            store = schemaweekday.getStore();

        if(cellIndex == 2) {
            if((schemamap) && (schemamap.length != 0)) {

                record.store.each(function(rec,index) {
                    rec.set('isselected',false);
                },me);

                record.set('isselected',true);

                schemamap = Ext.decode(schemamap);
                store.removeAll();
                store.loadData(schemamap);

                me.setWeekDayData(schemaweekday);

                view.down('numberfield[name=weekold]').setValue(record.get('weekold'));
                view.down('numberfield[name=weeknew]').setValue(record.get('weeknew'));

                return false;
            }

            param.action = 'select';
            param.method = 'selectWeekDay';
            param.weekday = record.get('weekday');
            param.positioncute = 1;
            param.id = view.down('hiddenfield[name=id]').getValue();

            store.setParams(param).load({
                scope: me,
                callback: function(records, operation, success) {
                    record.store.each(function(rec,index) {
                        rec.set('isselected',false);
                    },me);

                    record.set('isselected',true);

                    me.setWeekDayData(schemaweekday);
                }
            });
        }

    }

});