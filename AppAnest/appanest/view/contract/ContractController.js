Ext.define( 'AppAnest.view.contract.ContractController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.contract',

    stores: [
        'AppAnest.store.person.*',
        'AppAnest.store.contract.*'
    ],

    models: [
        'AppAnest.model.person.*',
        'AppAnest.model.contract.*'
    ],

    views: [
        'AppAnest.view.contract.*'
    ],

    config: {
        control: {
            'contractlist gridpanel': {
                additiveitem: 'onAdditiveItem'
            },
            'contractview': {
                afterrender: 'onAfterRenderView'
            }
        }
    },

    routes: {
        'contractview/:id': {
            action: 'getAdditiveId'
        }
    },

    init: function() {
        this.listen({
            store: {
                '#additivetable': {
                    load: 'onLoadStore',
                    update: 'onUpdateStore'
                }
            }
        });
    },

    url: 'business/Class/contract.php',

    onLoadStore: function ( store, records, successful, eOpts ) {
        var me = this,
            amount = 0,
            shiftvalue = 0.00,
            view = me.getView(),
            shiftamount = view.down('textfield[name=shiftamount]'),
            totalshiftvalue = view.down('textfield[name=totalshiftvalue]');

        store.each(function (record,index) {
            amount += parseFloat(record.get('shiftamount'));
            shiftvalue += parseFloat(record.get('shiftamount')) * parseFloat(record.get('shiftvalue'));
        });

        shiftamount.setValue(amount);
        totalshiftvalue.setValue(shiftvalue);
    },

    onUpdateStore: function ( store, record, operation, modifiedFieldNames, details, eOpts ) {
        var me = this;
        me.onLoadStore(store);
    },

    onItemDblClick: function (dataView, record, item, index, e, eOpts) {
        var downData = "business/Class/contractdata.php?action=getfile&method=loadFile&tableName={0}&id={1}";

        window.open(Ext.String.format(downData, record.get('tablename'), record.get('id').substring(0,4)));
    },

	onSubUnitEdit: function (editor, context, eOpts) {
		var me = this,
            record = context.record,
            store = editor.grid.store;

        if ( record.get('isactive') == false ) record.set('id','');

        store.sync({
            scope: me,
            success: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                me.onUpdateView(record);

                if(resultSet.records.length != 0) {
                    var data = resultSet.records[0];
                    record.set('isactive',true);
                    record.set('id',data.id);
                    record.commit();
                }
            },
            failure: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                if(resultSet) {
                    Ext.Msg.show({
                        title: 'Operação falhou!',
                        msg: resultSet.getMessage(),
                        buttons: Ext.Msg.CANCEL,
                        icon: Ext.Msg.WARNING
                    });
                }
            }
        });

        record.commit();
    },

    onUpdateView: function (record) {
        var me = this,
            xdata = me.getView().xdata,
            subunitStore = me.lookupReference('subunit').getStore(),
            additiveStore = me.lookupReference('additiveshift').getStore(),
            subunitModel = subunitStore.findRecord('id',record.get('contractorsubunitid'));

        Ext.Ajax.request({
            url: 'business/Class/additiveshift.php',
            params: {
                action: 'select',
                method: 'updateView',
                additiveid: xdata.get('id'),
                contractid: xdata.get('contractid'),
                contractorunitid: subunitModel.get('contractorunitid'),
                contractorsubunitid: record.get('contractorsubunitid')
            },
            success: function(response){
                var shiftstotal = 0.00,
                    result = Ext.decode(response.responseText),
                    recordRoot = additiveStore.findRecord('id',result.rows[0].contractnumber),
                    recordUnit = additiveStore.findRecord('id',subunitModel.get('contractorunitid'));

                subunitModel.set('shiftstotal',result.rows[0].totaladditiveshift);
                subunitModel.commit();

                recordRoot.set('released',result.rows[0].totalreleased);
                recordRoot.commit();

                subunitStore.each(function (rec,index) {
                    shiftstotal += parseFloat(rec.get('shiftstotal'));
                });

                recordUnit.set('released',shiftstotal);
                recordUnit.commit();
            },
            failure: function(response){
            }
        });
    },

    onAdditiveTableEdit: function (editor, context, eOpts) {
        var me = this,
            record = context.record,
            store = editor.grid.store;

        if ( record.get('isactive') == false ) record.set('id','');

        store.sync({
            scope: me,
            success: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                if(resultSet.records.length != 0) {
                    var rec = resultSet[0];
                    record.set('isactive',true);
                    record.set('id',rec.get('id'));
                    record.commit();
                }
            },
            failure: function ( batch, options ) {
                var resultSet = batch.getOperations().length !== 0 ? batch.operations[0].getResultSet() : null;

                if(resultSet) {
                    Ext.Msg.show({
                        title: 'Operação falhou!',
                        msg: resultSet.getMessage(),
                        buttons: Ext.Msg.CANCEL,
                        icon: Ext.Msg.WARNING
                    });
                }
            }
        });

        record.commit();
    },

    onSubUnitTabChange: function (tabPanel, newCard, oldCard, eOpts) {
        var me = this;

        me.getView().down('button[name=updateView]').setDisabled(newCard.index != 3);

        switch(newCard.index) {
            case 0:
                break;
            case 1:
                me.showAdditiveData();
                break;
            case 2:
                me.showContractUnit();
                break;
            case 3:
                me.showContractData();
                break;
        }
    },

    showContractData: function () {
        var me = this,
            xdata = me.getView().xdata,
            store = Ext.getStore('contractdata');

        store.setParams({
            method: 'selectCode',
            contractid: xdata.get('contractid')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                if(records.length != 0) {
                }
            }
        });
    },

    showContractUnit: function () {
        var me = this,
            xdata = me.getView().xdata,
            additiveshift = me.lookupReference('additiveshift'),
            showfilter = me.getView().down('radiogroup').getValue().showfilter;

        additiveshift.setLoading('Carregando unidades!');

        Ext.Ajax.request({
            url: 'business/Class/additiveshift.php',
            params: {
                action: 'select',
                method: 'selectTree',
                showfilter: showfilter,
                additiveid: xdata.get('id'),
                contractid: xdata.get('contractid')
            },
            success: function(response){
                var root = Ext.decode(response.responseText);
                additiveshift.setRootNode(root);
                additiveshift.setLoading(false);
                Ext.getStore('additiveshift').removeAll();
                Ext.getStore('contractorsubunit').removeAll();
            },
            failure: function(response){
                additiveshift.setLoading(false);
            }
        });
    },

    showAdditiveData: function () {
        var me = this,
            xdata = me.getView().xdata,
            store = Ext.getStore('additivetable');

        store.setParams({
            method: 'selectCode',
            additiveid: xdata.get('id')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                if(records.length != 0) {
                }
            }
        });
    },

    onUnitSelect: function (rowModel, record, index, eOpts) {
        var me = this,
            store = Ext.getStore('contractorsubunit'),
            column = me.lookupReference('subunit').getColumnManager().getFirst();

        column.setText('SubUnidades: <b>' + record.get('text').toUpperCase() + '</b>');

        store.setParams({
            method: 'selectCodeAdditive',
            contractorunitid: record.get('id'),
            additiveid: record.get('additiveid')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                if(records.length != 0) {
                    me.lookupReference('subunit').getSelectionModel().select(0);
                }
                Ext.getStore('additiveshift').removeAll();
            }
        })
    },

    onSubUnitSelect: function (rowModel, record, index, eOpts) {
        var me = this,
            store = Ext.getStore('additiveshift');

        store.setParams({
            additiveid: me.lookupReference('id').getValue(),
            contractorsubunitid: record.get('id'),
            method: 'selectCode'
        }).load();
    },

    onChangeDutyValue: function ( field, newValue, oldValue, eOpts ) {
        var form = field.up('form'),
            totaldutyvalue = form.down('textfield[name=totaldutyvalue]'),
            dutyvalue = form.down('textfield[name=dutyvalue]').getValue(),
            dutyamount = form.down('numberfield[name=dutyamount]').getValue();

        totaldutyvalue.setValue(parseInt(dutyamount) * parseFloat(dutyvalue));
    },

    onAdditiveItem: function (gridpanel, id) {
        var me = this,
            actId = id.substr(7,3),
            store = gridpanel.store,
            model = store.findRecord('contractnumber',id.substr(0,7),0,false,true,true);

        switch(id.length) {
            case 09:
                me.additiveItemView(model,actId);
                break;
            case 10:
                me.additiveItemEdit(model,actId);
                break;
        }
    },

    additiveItemView: function (model,actId) {
        var me = this,
            store = Ext.create('AppAnest.store.contract.Additive'),
            additive = parseInt(actId) == 1 ? Ext.widget('contractadditivenew') : Ext.widget('contractadditivelog');

        store.setParams({
            query: model.get('id'),
            method: parseInt(actId) == 1 ? 'selectNew' : 'selectLog'
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                additive.show(null,function () {
                    if(parseInt(actId) == 1) {
                        additive.down('form').loadRecord(record);
                        additive.down('form').down('hiddenfield[name=id]').reset();
                        additive.down('form').down('hiddenfield[name=contractid]').setValue(model.get('id'));
                    }
                });
            }
        });
    },

    additiveItemEdit: function (model,actId) {
        var me = this,
            store = Ext.getStore('additive') || Ext.create('AppAnest.store.contract.Additive');

        store.setParams({
            method: 'selectCode',
            additivenumber: actId,
            contractid: model.get('id')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                me.redirectTo( 'contractview/' + record.get('id'));
            }
        });

    },

    onContractNew: function () {
        Ext.widget('contractnew');
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form');

        if(!container.xdata) return false;

        form.loadRecord(container.xdata);
    },

    onChangeShowFilter: function (field,newValue,oldValue,epts) {
        this.showContractUnit();
    },

    getAdditiveId: function (id) {
        var app = AppAnest.app.getController('App'),
            record = Ext.getStore('additive').findRecord('id',id);

        app.addToMainCenterRegion({xtype: 'contractview', xdata: record});
    },

    onViewEdit: function (btn) {
        var me = this,
            model = btn.getWidgetRecord(),
            store = Ext.getStore('additive');

        btn.up('window').close();

        store.setParams({
            method: 'selectCode',
            contractid: model.get('contractid'),
            additivenumber: model.get('additivenumber')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                me.redirectTo( 'contractview/' + record.get('id'));
            }
        });
    },

    onSearchClick: function (search, button) {
        var store = Ext.getStore('contract');

        store.setParams({
            query: search.getValue()
        }).load();
    },

    updateContractNew: function (btn) {
        var me = this,
            view = btn.up('window'),
            store = Ext.getStore('contract');

        me.setModuleData(store);
        me.setModuleForm(view.down('form'));

        me._success = function () {
            view.close();
            store.load();
        }

        me.updateModule(null,store.getUrl());
    },

    updateAdditiveNew: function (btn) {
        var me = this,
            view = btn.up('window'),
            store = Ext.getStore('additive');

        me.setModuleData(store);
        me.setModuleForm(view.down('form'));

        me._success = function () {
            view.close();
            Ext.getStore('contract').load();
        }

        me.updateModule(null,store.getUrl());
    },

    updateView: function (btn) {
        var me = this,
            view = btn.up('contractview'),
            store = Ext.getStore('contractdata'),
            form = view.down('form[name=contractdata]');

        form.down('hiddenfield[name=contractid]').setValue(view.xdata.get('contractid'));

        me.setModuleData(store);
        me.setModuleForm(form);

        me._success = function () {
            form.reset();
            Ext.getStore('contractdata').load();
        }

        me.updateModule(null,store.getUrl());
    }

});