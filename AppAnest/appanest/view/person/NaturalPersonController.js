//@charset ISO-8859-1
Ext.define(	'AppAnest.view.person.NaturalPersonController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.naturalperson',

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
            'naturalpersonlist': {
            },
            'naturalpersonview': {
                afterrender: 'onAfterRenderView'
            },
            'naturalpersonview portrait filefield': {
                loadend: 'onLoadEnd'
            },
            'naturalpersonview gridpanel[name=phone]': {
                select: 'onSelectPhone'
            },
            'naturalpersonview gridpanel[name=bank]': {
                select: 'onSelectBank'
            }
        }
    },

    routes: {
        'naturalpersonview/:id': {
            action: 'getNaturalPersonId'
        },
        'naturalpersonnew': {
            action: 'getNaturalPersonNew'
        }
    },

    url: 'business/Class/naturalperson.php',

    getUserCardIndex: function (btn) {
        var me = this,
            listViews = me.lookupReference('listViews');
        listViews.getLayout().setActiveItem(btn.cardIndex);
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('naturalpersonnew');
    },

    getNaturalPersonNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'naturalpersonview', xdata: null});
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
            view = btn.up('naturalpersonview'),
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

    insertBank: function (btn) {
        var me = this,
            bankForm = me.lookupReference('bankForm');
        bankForm.reset();
        bankForm.down('comboenum[name=bankdescription]').focus(false, 200);
        btn.up('personbank').down('gridpanel[name=bank]').getSelectionModel().deselectAll();
    },

    updateBank: function (btn) {
        var me = this,
            view = btn.up('naturalpersonview'),
            id = view.down('hiddenfield[name=id]'),
            bankForm = me.lookupReference('bankForm'),
            url = 'business/Class/personbank.php';

        bankForm.down('hiddenfield[name=personid]').setValue(id.getValue());

        me.setModuleData('personbank');
        me.setModuleForm(bankForm);

        me._success = function () {
            me.insertBank(btn);
            view.down('gridpanel[name=bank]').store.load();
        }

        me.updateModule(null,url);
    },

    updateView: function (btn) {
        var me = this,
            view = btn.up('naturalpersonview'),
            portrait = me.lookupReference('portrait'),
            bankForm = me.lookupReference('bankForm'),
            phoneForm = me.lookupReference('phoneForm');

        bankForm.down('hiddenfield[name=id]').setDisabled(true);
        phoneForm.down('hiddenfield[name=id]').setDisabled(true);

        me.setModuleData('naturalperson');
        me.setModuleForm(view.down('form'));

        me._success = function (form, action) {
            var record = form.getRecord();
            me.lookupReference('bank').setDisabled(false);
            me.lookupReference('phone').setDisabled(false);
            bankForm.down('hiddenfield[name=id]').setDisabled(false);
            phoneForm.down('hiddenfield[name=id]').setDisabled(false);
            view.down('hiddenfield[name=id]').setValue(record.get('id'));
        }

        me._failure = function (form, action) {
            bankForm.down('hiddenfield[name=id]').setDisabled(false);
            phoneForm.down('hiddenfield[name=id]').setDisabled(false);
        }

        me.updateModule();
    },

    insertView: function (btn) {
        var me = this,
            view = btn.up('naturalpersonview'),
            portrait = me.lookupReference('portrait'),
            storeBank = Ext.getStore('personbank'),
            storePhone = Ext.getStore('personphone');

        view.down('form').reset();
        portrait.beFileData();

        storeBank.removeAll();
        storePhone.removeAll();

        view.down('tabpanel').setActiveTab(0);
        me.lookupReference('bank').setDisabled(true);
        me.lookupReference('phone').setDisabled(true);
        view.down('textfield[name=shortname]').focus(false, 200);
    },

    onSearchClick: function (search, button) {
        var store = Ext.getStore('naturalperson');

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
        me.redirectTo( 'naturalpersonview/' + record.get('id'));
    },

    getNaturalPersonId: function (id) {
        var me = this,
            app = AppAnest.app.getController('App'),
            record = Ext.getStore('naturalperson').findRecord('id',id);
        app.addToMainCenterRegion({xtype: 'naturalpersonview', xdata: record});
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            portrait = form.down('portrait'),
            store = Ext.getStore('naturalperson'),
            storeBank = container.down('gridpanel[name=bank]').store,
            storePhone = container.down('gridpanel[name=phone]').store;

        if(!container.xdata) {
            container.down('textfield[name=shortname]').focus(false, 200);
            return false;
        }

        me.lookupReference('bank').setDisabled(false);
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
                storeBank.setParams({
                    query: record.get('id'),
                    method: 'selectCode'
                }).load();
            }
        });

        portrait.setUrl(me.url);
        portrait.beFileData(container.xdata.get('filetype'));
    }

});