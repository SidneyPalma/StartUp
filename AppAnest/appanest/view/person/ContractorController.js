//@charset ISO-8859-1
Ext.define(	'AppAnest.view.person.ContractorController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.contractor',

    stores: [
        'AppAnest.store.person.Contractor'
    ],

    models: [
        'AppAnest.model.person.Contractor'
    ],

    views: [
        'AppAnest.view.person.*'
    ],

    config: {
        control: {
            'contractorlist': {
            },
            'contractorview': {
                afterrender: 'onAfterRenderView'
            },
            'contractorview portrait filefield': {
                loadend: 'onLoadEnd'
            },
            'contractorview gridpanel[name=phone]': {
                select: 'onSelectPhone'
            }
        }
    },

    routes: {
        'contractorview/:id': {
            action: 'getContractorId'
        },
        'contractorview': {
            action: 'getContractorNew'
        }
    },

    url: 'business/Class/contractor.php',

    getUserCardIndex: function (btn) {
        var me = this,
            listViews = me.lookupReference('listViews');
        listViews.getLayout().setActiveItem(btn.cardIndex);
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('contractorview');
    },

    getContractorNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'contractorview', xdata: null});
    },

    onSelectPhone: function (rowModel, record, index, eOpts ) {
        var me = this,
            phoneForm = me.lookupReference('phoneForm');

        phoneForm.loadRecord(record);
    },

    onSelectBank: function (rowModel, record, index, eOpts ) {
        var me = this,
            bankForm = me.lookupReference('bankForm');

        bankForm.loadRecord(record);
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
        phoneForm.down('textfield[name=ddd]').focus(false, 200);
        btn.up('personphone').down('gridpanel[name=phone]').getSelectionModel().deselectAll();
    },

    updatePhone: function (btn) {
        var me = this,
            view = btn.up('contractorview'),
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
            view = btn.up('contractorview'),
            portrait = me.lookupReference('portrait'),
            phoneForm = me.lookupReference('phoneForm');

        phoneForm.down('hiddenfield[name=id]').setDisabled(true);

        me.setModuleData('contractor');
        me.setModuleForm(view.down('form'));

        me._success = function (form, action) {
            var record = form.getRecord();
            me.lookupReference('phone').setDisabled(false);
            phoneForm.down('hiddenfield[name=id]').setDisabled(false);
            view.down('hiddenfield[name=id]').setValue(record.get('id'));
        }

        me._failure = function (form, action) {
            phoneForm.down('hiddenfield[name=id]').setDisabled(false);
        }

        me.updateModule();
    },

    insertView: function (btn) {
        var me = this,
            view = btn.up('contractorview'),
            portrait = me.lookupReference('portrait'),
            storePhone = Ext.getStore('personphone');

        view.down('form').reset();
        portrait.beFileData();

        storePhone.removeAll();

        view.down('tabpanel').setActiveTab(0);
        me.lookupReference('phone').setDisabled(true);
        view.down('textfield[name=shortname]').focus(false, 200);
    },

    onSearchClick: function (search, button) {
        var store = Ext.getStore('contractor');

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
        me.redirectTo( 'contractorview/' + record.get('id'));
    },

    getContractorId: function (id) {
        var me = this,
            app = AppAnest.app.getController('App'),
            record = Ext.getStore('contractor').findRecord('id',id);
        app.addToMainCenterRegion({xtype: 'contractorview', xdata: record});
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            portrait = form.down('portrait'),
            store = Ext.getStore('contractor'),
            storePhone = container.down('gridpanel[name=phone]').store;

        if(!container.xdata) {
            container.down('textfield[name=shortname]').focus(false, 200);
            return false;
        }

        me.lookupReference('phone').setDisabled(false);

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
            }
        });

        portrait.setUrl(me.url);
        portrait.beFileData(container.xdata.get('filetype'));
    }

});