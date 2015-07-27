//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchemaController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.allocationschema',

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
            //schemamonthly = me.lookupReference('schemamonthly'),
            schemamap = view.down('gridpanel[name=schemamonthlymap]'),
            allocationschemap = me.lookupReference('allocationschemap'),
            schemaweekday = view.down('gridpanel[name=schemaweekday]');

        schema.getLayout().setActiveItem(newValue.type);
        allocationschemap.getLayout().setActiveItem(newValue.type);

        view.down('periodsearch').setReadOnlyColor(newValue.type == 1);

        switch (newValue.type) {
            case 0:
                break;
            case 1:
                schemaweekday.store.removeAll();
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

    onChangeFilter: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            view = me.getView(),
            store = view.down('gridpanel[name=allocationschemaweek]').getStore();

        store.clearFilter();
        store.filter('contractorunit',newValue);
    },

    onChangeFilterWeekly: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            view = me.getView(),
            store = view.down('gridpanel[name=allocationschemaweekly]').getStore();

        store.clearFilter();
        store.filter('contractorunit',newValue);
    },

    onSelectPeriod: function ( combo, record, eOpts ) {
        var me = this,
            param = {},
            view = me.getView(),
            schema = view.down('container[name=schema]'),
            form = view.down('form[name=schemamonthly]'),
            periodid = form.down('hiddenfield[name=periodid]'),
            allocationschema = Ext.getStore('allocationschema'),
            schemamonthly = view.down('gridpanel[name=schemamonthly]');

        param.query = record.get('id');
        param.action = 'select';
        param.method = 'selectCode';

        form.reset();
        schemamonthly.getStore().removeAll();

        view.down('radiogroup').down('#type1').setDisabled(true);

        allocationschema.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                var allocationschemaid;

                if(records.length && success == true) {
                    var rec = records[0];
                    allocationschemaid = rec.get('id');
                    form.loadRecord(rec);
                    console.info(rec.data);
                    view.down('radiogroup').down('#type1').setDisabled(false);
                } else {
                    periodid.setValue(record.get('id'));
                }

                schema.setDisabled(false);

                param.action = 'select';
                param.method = 'selectWeek';
                param.allocationschemaid = allocationschemaid;
                view.setLoading('Carregando esquema ...');

                schemamonthly.getStore().setParams(param).load({
                    scope: me,
                    callback: function(records, operation, success) {
                        view.setLoading(false);
                        if(records.length && success == true) {
                        }
                    }
                });
            }
        });
    },

    onUpdateSchemaMonthly: function () {
        var me = this,
            list = [],
            view = me.getView(),
            form = view.down('form[name=schemamonthly]'),
            store = view.down('gridpanel[name=schemamonthly]').getStore();

        store.each(function(record,index) {
            list.push(record.data);
        },me);

        form.down('hiddenfield[name=schemaweek]').setValue(Ext.encode(list));

        me.setModuleData('allocationschema');
        me.setModuleForm(form);

        me._success = function (frm, action) {
            var record = frm.getRecord();
            view.down('radiogroup').down('#type1').setDisabled(false);
            form.down('hiddenfield[name=id]').setValue(record.get('id'));
        }

        me._failure = function (frm, action) {
        }

        me.updateModule();
    },

    onUpdateSchemaWeekDay: function () {
        var me = this,
            list = [],
            view = me.getView(),
            grid = view.down('gridpanel[name=schemamonthlymap]'),
            model = grid.getSelectionModel().getSelection()[0],
            weekdayStore = view.down('gridpanel[name=schemaweekday]').getStore();

        if ( weekdayStore.getCount() == 0) {
            return false;
        }

        weekdayStore.each(function(record,index) {
            list.push(record.data);
        },me);

        model.set('schemamap',Ext.encode(list));
        model.set('id',( model.get('id').length == 0 ? '' : model.get('id') ));
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
        var fixed = [2, 3, 4, 5, 6, 7, 8],
            items = editor.getEditor().items,
            field = context.field.replace('description',''),
            lists = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

        Ext.each(fixed, function (value, index) {
            var weekday = parseInt(context.record.get(lists[index]));
            items.getAt(value).setDisabled(weekday == 0);
        });

        return parseInt(context.record.get(field)) !== 0;
    },

    onChangeCute: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            view = me.getView(),
            grid = view.down('gridpanel[name=schemamonthlymap]'), //allocationschemaweekly schemamonthlymap
            store = grid.getStore(),
            recOld = store.findRecord('position',oldValue),
            recNew = store.findRecord('position',newValue);

        grid.getSelectionModel( )

        if(recNew && recOld) {
            recOld.set('positioncute',0);
            recOld.commit();
            recNew.set('positioncute',1);
            recNew.commit();
        }
    },

    onDeleteMonthly: function () {
        var me = this,
            view = me.getView();
    },

    onDeleteWeekDay: function () {
        var me = this,
            view = me.getView(),
            grid = view.down('gridpanel[name=schemamonthlymap]'),
            model = grid.getSelectionModel().getSelection()[0],
            weekdayStore = view.down('gridpanel[name=schemaweekday]').getStore();

        if ( model.get('id').length == 0 ) {
            return false;
        }

        model.set('schemamap','');
        model.store.sync({
            success: function (batch, options) {
                weekdayStore.removeAll();
                model.store.each(function(rec,index) {
                    rec.set('isselected',false);
                    rec.commit();
                },me);
                model.commit();
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
    },

    setWeekDayData: function (schemaweekday) {
        var store = schemaweekday.getStore(),
            getFields = function () {
            var fields = [], i,
                dutyamount = store.getCount();

            for (i = 1; i <= dutyamount; i++) {
                fields.push({
                    text: '<a style="color: blue;">' + i + '</a>',
                    align: 'center',
                    dataIndex: 'week' + Ext.String.leftPad(i, 2, '0'),
                    width: 30,
                    renderer: function (value, meta, rec, rowIndex) {
                        var color = parseInt(rec.get('position')) % 2 == 0,
                            metaStyle = (color) ? '' : 'background-color: rgba(242, 243, 235, .9)';

                        meta.style = (parseInt(rowIndex) == parseInt(rec.get('positioncute'))-1) ? 'background-color: rgba(254, 189, 98, .5)' : metaStyle;

                        if(parseInt(value) == 1) {
                            meta.style = 'background-color: rgb(189, 252, 0)';
                        }

                        return value;
                    }
                });
            }

            return fields;
        };

        Ext.suspendLayouts();

        schemaweekday.reconfigure(store, [
            {
                text: '<a style="color: blue; font-size: 18px; font-family: Monda;">' + 'U N I D A D E S' + '</a>',
                align: 'center',
                columns: [
                    {
                        align: 'left',
                        text: 'Unidade',
                        dataIndex: 'contractorunit',
                        width: 120,
                        renderer: function (value, meta, record, rowIndex, colIndex, store) {
                            var first = !rowIndex || value !== store.getAt(rowIndex - 1).get('contractorunit'),
                                color = parseInt(record.get('position')) % 2 == 0,
                                metaStyle = (color) ? 'color: white; background-color: rgba(84, 86, 62, .9);' : 'background-color: rgba(84, 86, 62, .4);';

                            meta.style = metaStyle + ' font-family: Monda;';

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
                align: 'center',
                text: '<a style="color: blue; font-size: 18px; font-family: Monda;">' + 'S E M A N A S' + '</a>',
                columns: getFields()
            }
        ]);

        Ext.resumeLayouts(true);
    },

    onCellDblClick: function ( viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
        var me = this,
            view = me.getView(),
            fm = view.down('form[name=schemaweekday]'),
            param = fm.getValues(),
            schemamap = record.get('schemamap'),
            schemaweekday = view.down('gridpanel[name=schemaweekday]'),
            store = schemaweekday.getStore();

        if((schemamap) && (schemamap.length != 0)) {

            record.store.each(function(rec,index) {
                rec.set('isselected',false);
            },me);

            record.set('isselected',true);

            schemamap = Ext.decode(schemamap);
            store.removeAll();
            store.loadData(schemamap);

            me.setWeekDayData(schemaweekday);

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

});