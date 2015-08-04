//@charset ISO-8859-1
Ext.define(	'AppAnest.view.person.ContractorUnitController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.contractorunit',

    stores: [
        'AppAnest.store.person.*'
    ],

    models: [
        'AppAnest.model.person.*'
    ],

    views: [
        'AppAnest.view.person.*'
    ],

    config: {
        control: {
            'contractorunitlist': {
            },
            'contractorunitview': {
                afterrender: 'onAfterRenderView'
            },
            'contractorunitview portrait filefield': {
                loadend: 'onLoadEnd'
            },
            'contractorunitview gridpanel[name=phone]': {
                select: 'onSelectPhone'
            },
            'contractorunitview checkcolumn': {
                checkchange: 'onCheckChange'
            }
        }
    },

    routes: {
        'contractorunitview/:id': {
            action: 'getContractorUnitId'
        },
        'contractorunitview': {
            action: 'getContractorUnitNew'
        }
    },

    url: 'business/Class/contractorunit.php',

    onCellClick: function ( viewTable, td, cellIndex, record ) {
        var me = this,
            params = {},
            field = ['mon','tue','wed','thu','fri'],
            value = (cellIndex != 0) ? record.get(field[cellIndex-1]) : '';

        if((value)&&(value.length != 0)) {
            var model = Ext.create('AppAnest.model.person.ContractorUnitSchema');

            params.action = 'delete';
            params.rows = Ext.encode({id: record.get(field[cellIndex-1])});

            Ext.Msg.show({
                title:'Removendo número de Sócio da lista!',
                message: 'Confirma a remoção deste Sócio?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        viewTable.setLoading('Removendo o registro...');
                        Ext.Ajax.request({
                            scope: me,
                            url: record.store.getUrl(),
                            params: params,
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

    onUpdateShifts: function () {
        var me = this,
            view = me.getView(),
            shifts = me.lookupReference('shifts'),
            values = shifts.down('form').getValues();

        if(shifts.down('form').isValid()) {
            var store = shifts.down('gridpanel').getStore(),
                model = Ext.create('AppAnest.model.person.ContractorUnitSchema');

            values.id = null;
            values.contractorunitid = view.down('hiddenfield[name=id]').getValue();

            model.set(values);
            store.add(model);
            store.sync({
                scope: me,
                success: function ( batch, options ) {
                    store.load();
                },
                failure: function ( batch, options ) {
                }
            });
        }
    },

    getUserCardIndex: function (btn) {
        var me = this,
            listViews = me.lookupReference('listViews');
        listViews.getLayout().setActiveItem(btn.cardIndex);
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('contractorunitview');
    },

    getContractorUnitNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'contractorunitview', xdata: null});
    },

    onSelectPhone: function (rowModel, record, index, eOpts ) {
        var me = this,
            linetype = record.get('linetype'),
            mobiledigit = record.get('mobiledigit'),
            phoneForm = me.lookupReference('phoneForm'),
            phonenumber = phoneForm.down('textfield[name=phonenumber]');

        phonenumber.setMask(mobiledigit);

        phoneForm.loadRecord(record);
    },

    onCheckChange: function (checkcolumn, rowIndex, checked, eOpts) {
        var me = this,
            grid = me.lookupReference('gridsubunit'),
            sm = grid.getSelectionModel(),
            store = grid.store,
            showCheck = checked ? {
                name: 'reserved',
                xtype: 'checkboxfield',
                boxLabel: 'Tornar esta SubUnidade Exclusiva?'
            } : {};

        sm.select(rowIndex);
        var record = sm.getSelection()[0];

        Ext.widget('window', {
            width: 400,
            modal: true,
            layout: 'fit',
            autoShow: true,
            title: checked ? 'Inclusão!' : 'Exclusão!',
            items: [
                {
                    padding: 10,
                    xtype: 'form',
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'label',
                            text: 'Confirmar Operação na Lista de SubUnidades?',
                            style: {
                                color: 'blue;',
                                fontSize: '14px;'
                            }
                        }, showCheck
                    ]
                }
            ],
            buttonAlign: 'center',
            buttons: [
                {
                    scope: me,
                    text: 'Confirmar',
                    handler: function (btn) {
                        if(!checked) {
                            store.remove(record);
                        } else {
                            var reserved = btn.up('window').down('checkboxfield[name=reserved]').getValue();
                            record.set('id','');
                            record.set('reserved',reserved);
                        }
                        store.sync({
                            scope: me,
                            success: function ( batch, options ) {
                                btn.up('window').close();
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
                    }
                }, {
                    scope: me,
                    text: 'Cancelar',
                    handler: function (btn) {
                        btn.up('window').close();
                    }
                }
            ],
            listeners:  {
                destroy: function () {
                    store.load();
                }
            }
        });
    },

    onLoadEnd: function (field,file) {
        var me = this,
            portrait = me.lookupReference('portrait');

        field.doFileData(portrait);
        portrait.down('hiddenfield[name=fieldData]').setValue(field.getFileName());
    },

    insertPhone: function (btn) {
        var me = this,
            phoneForm = me.lookupReference('phoneForm');
        phoneForm.reset();
        phoneForm.down('comboenum[name=linetypedescription]').focus(false, 200);
        btn.up('personphone').down('gridpanel[name=phone]').getSelectionModel().deselectAll();
    },

    updatePhone: function (btn) {
        var me = this,
            view = btn.up('contractorunitview'),
            id = view.down('hiddenfield[name=id]'),
            phoneForm = me.lookupReference('phoneForm'),
            url = 'business/Class/personphone.php';

        phoneForm.down('hiddenfield[name=personid]').setValue(id.getValue());

        me.setModuleData('personphone');
        me.setModuleForm(phoneForm);

        me._success = function () {
            me.insertPhone(btn);
            view.down('gridpanel[name=phone]').store.load();
        }

        me.updateModule(null,url);
    },

    updateView: function (btn) {
        var me = this,
            view = btn.up('contractorunitview'),
            portrait = me.lookupReference('portrait'),
            phoneForm = me.lookupReference('phoneForm');

        phoneForm.down('hiddenfield[name=id]').setDisabled(true);

        me.setModuleData('contractorunit');
        me.setModuleForm(view.down('form'));

        me._success = function (form, action) {
            var record = form.getRecord();
            me.lookupReference('phone').setDisabled(false);
            phoneForm.down('hiddenfield[name=id]').setDisabled(false);
            view.down('hiddenfield[name=id]').setValue(record.get('id'));
            view.down('contractorsearch[name=parentname]').setReadOnlyColor(true);
        }

        me._failure = function (form, action) {
            phoneForm.down('hiddenfield[name=id]').setDisabled(false);
        }

        me.updateModule();
    },

    insertView: function (btn) {
        var me = this,
            view = btn.up('contractorunitview'),
            portrait = me.lookupReference('portrait'),
            storePhone = Ext.getStore('personphone');

        view.down('form').reset();
        portrait.beFileData();

        storePhone.removeAll();

        view.down('tabpanel').setActiveTab(0);
        me.lookupReference('phone').setDisabled(true);
        me.lookupReference('subunit').setDisabled(true);
        view.down('textfield[name=shortname]').focus(false, 200);
        view.down('contractorsearch[name=parentname]').setReadOnlyColor(false);
    },

    onSearchClick: function (search, button) {
        var store = Ext.getStore('contractorunit');

        store.setParams({
            query: search.getValue()
        }).load();
    },

    findedAddress: function (win,rec) {
        var me = this,
            address = me.lookupReference('address'),
            federationunit = address.down('comboenum[name=addressfederationunitdescription]');

        address.down('textfield[name=address]').setValue(rec.get('Logradouro'));
        address.down('maskzipcode[name=addresszipcode]').setValue(rec.get('CEP'));
        address.down('textfield[name=addressneighborhood]').setValue(rec.get('Bairro'));
        address.down('textfield[name=addresslocality]').setValue(rec.get('Localidade'));

        federationunit.setValue(rec.get('UF'));
        federationunit.doQuery(rec.get('Localidade')+','+rec.get('UF'));

        win.close();
    },

    onAddressSearchClick: function (search, button) {
        var me = this;
        Ext.widget('searchaddress',{ url: me.url, findedAddress: me.findedAddress, scope: me });
    },

    onViewEdit: function (btn) {
        var me = this,
            record = btn.getWidgetRecord();
        me.redirectTo( 'contractorunitview/' + record.get('id'));
    },

    getContractorUnitId: function (id) {
        var me = this,
            app = AppAnest.app.getController('App'),
            record = Ext.getStore('contractorunit').findRecord('id',id);
        app.addToMainCenterRegion({xtype: 'contractorunitview', xdata: record});
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            portrait = form.down('portrait'),
            store = Ext.getStore('contractorunit'),
            storeSubUnit = Ext.getStore('contractorsubunit'),
            storeUnitSchema = Ext.getStore('contractorunitschema'),
            id = form.down('hiddenfield[name=id]').getValue(),
            storePhone = container.down('gridpanel[name=phone]').store;

        if(!container.xdata) {
            container.down('textfield[name=shortname]').focus(false, 200);
            return false;
        }

        me.lookupReference('phone').setDisabled(false);
        me.lookupReference('subunit').setDisabled(false);

        store.setParams({
            query: container.xdata.get('id'),
            method: 'selectCode'
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                form.loadRecord(record);
                storePhone.setParams({
                    query: record.get('id'),
                    method: 'selectCode'
                }).load();
                storeSubUnit.setParams({
                    query: record.get('id'),
                    method: 'selectCode'
                }).load();
                storeUnitSchema.setParams({
                    query: record.get('id'),
                    method: 'selectCode'
                }).load();
            }
        });

        portrait.setUrl(me.url);
        portrait.beFileData(container.xdata.get('filetype'));
        form.down('contractorsearch[name=parentname]').setReadOnlyColor(id.lenght != 0);
    }

});