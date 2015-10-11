//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.ContractorUnitSchemaController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.contractorunitschema',

    requires: [
        'Smart.util.Message'
    ],

    init: function() {
        this.listen({
            store: {
                '#contractorunitschemasearch': {
                    beforeload: 'onSelectSchedulingPeriod'
                }
            }
        });
    },

    config: {
        control: {
            'contractorunitschema comboenum[name=allocationtypedescription]': {
                select: 'onSelectAllocationSchema',
                beforequery: 'onBeforeQueryAllocationType'
            }
        }
    },

    onSelectAllocationSchema: function (combo, record, eOpts) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=schemaparams]'),
            param = form.getValues(),
            store = Ext.getStore('contractorunitschemashow');

        param.action = 'select';
        param.method = 'selectCode';
        param.allocationtype = record.get('allocationtype');

        store.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
            }
        });
    },

    onCellClickAllocationType: function ( viewTable, td, cellIndex, record, tr, rowIndex, e ) {
        var me = this,
            view = me.getView(),
            field = ['mon','tue','wed','thu','fri','sat','sun'],
            value = (cellIndex != 0) ? record.get(field[cellIndex-1]) : '';

        if(view.xdata.get('status') != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        if (e.ctrlKey === true) {
            if((value)&&(value.length != 0)) {
                var store = Ext.getStore('contractorunitschema'),
                    model = Ext.create('AppAnest.store.allocationschema.ContractorUnitSchema');

                Ext.Msg.show({
                    title:'Removendo o Socio da lista!',
                    message: 'Confirma a remocao deste Socio?',
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    fn: function(btn) {
                        if (btn === 'yes') {
                            viewTable.setLoading('Removendo o registro...');
                            Ext.Ajax.request({
                                scope: me,
                                url: store.getUrl(),
                                params: {
                                    action: 'delete',
                                    rows: Ext.encode({id: record.get(field[cellIndex-1])})
                                },
                                callback: function(options, success, response) {
                                    viewTable.setLoading(false);
                                    record.store.load();
                                }
                            });
                        }
                    }
                });
            }
        }

    },

    onCellClickReplacement: function ( viewTable, td, cellIndex, record, tr, rowIndex, e ) {
        var me = this,
            view = me.getView(),
            store = Ext.getStore('contractorunitreplacement');

        if(view.xdata.get('status') != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        if ((e.ctrlKey === true)&&(cellIndex == 0)) {
            Ext.Msg.show({
                title:'Removendo os Socios da lista!',
                message: 'Confirma a remocao destes Socios da lista de Substituicoes?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        viewTable.setLoading('Removendo o registro...');
                        Ext.Ajax.request({
                            scope: me,
                            url: store.getUrl(),
                            params: {
                                action: 'delete',
                                rows: Ext.encode({id: record.get('id')})
                            },
                            callback: function(options, success, response) {
                                viewTable.setLoading(false);
                                record.store.load();
                            }
                        });
                    }
                }
            });
        }

    },

    onBeforeQueryAllocationType: function (queryPlan, eOpts) {
        var me = this,
            view = me.getView(),
            form = view.down('form[name=schemaparams]');

        if(!form.isValid()) {
            return false;
        }
    },

    onSelectSchedulingPeriod: function (store, operation, eOpts) {
        var me = this,
            view = me.getView();

        view.down('form[name=allocationtype]').reset();
        Ext.getStore('contractorunitschemashow').removeAll();
        view.down('form[name=allocationtype]').setDisabled(false);
        store.setParams({schedulingperiodid: view.xdata.get('id')});
    },

    onSelectSchedulingSchema: function (combo, record, eOpts) {
        var me = this,
            view = me.getView(),
            param = record.getData(),
            form = view.down('form[name=schemaparams]'),
            replacement = view.down('form[name=replacement]'),
            allocationtype = view.down('form[name=allocationtype]'),
            storeSchemaShow = Ext.getStore('contractorunitschemashow'),
            storeReplacementShow = Ext.getStore('contractorunitreplacementshow');

        form.loadRecord(record);

        replacement.reset();
        allocationtype.reset();
        storeSchemaShow.removeAll();

        param.action = 'select';
        param.method = 'selectCode';

        storeReplacementShow.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                replacement.setDisabled(false);
            }
        });
    },

    onUpdateAllocationType: function () {
        var me = this,
            view = me.getView(),
            params01 = view.down('form[name=schemaparams]').getValues(),
            form = view.down('form[name=allocationtype]'),
            params02 = form.getValues(),
            values = Ext.Object.merge(params01, params02);

        if(view.xdata.get('status') != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        if(form.isValid()) {
            var store = Ext.getStore('contractorunitschema'),
                model = Ext.create('AppAnest.model.allocationschema.ContractorUnitSchema');

            values.id = null;

            model.set(values);
            store.add(model);

            store.sync({
                scope: me,
                success: function ( batch, options ) {
                    view.down('gridpanel[name=allocationtype]').store.removeAll();
                    view.down('gridpanel[name=allocationtype]').store.load();
                    form.down('naturalpersonsearch').reset();
                    form.down('numberfield').onSpinnerUpClick();
                },
                failure: function ( batch, options ) {
                }
            });
        }
    },

    onUpdateReplacement: function () {
        var me = this,
            view = me.getView(),
            params01 = view.down('form[name=schemaparams]').getValues(),
            form = view.down('form[name=replacement]'),
            params02 = form.getValues(),
            values = Ext.Object.merge(params01, params02);

        if(view.xdata.get('status') != 'A') {
            Smart.Msg.attention("A escala para este periodo nao esta mais aberta!");
            return false;
        }

        if(form.isValid()) {
            var days = values.weekday.split(','),
                store = Ext.getStore('contractorunitreplacement'),
                model = Ext.create('AppAnest.model.allocationschema.ContractorUnitReplacement');

            for (i = 0; i < days.length; i++) {
                values[days[i]] = 1;
            }

            delete values.weekday;

            values.id = null;

            model.set(values);
            store.add(model);

            store.sync({
                scope: me,
                success: function ( batch, options ) {
                    view.down('gridpanel[name=replacement]').store.removeAll();
                    view.down('gridpanel[name=replacement]').store.load();
                    form.down('naturalpersonsearch[name=naturalpersonidof]').reset();
                    form.down('naturalpersonsearch[name=naturalpersonidto]').reset();
                },
                failure: function ( batch, options ) {
                }
            });
        }
    }

});