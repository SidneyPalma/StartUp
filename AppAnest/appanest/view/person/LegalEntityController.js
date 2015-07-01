//@charset ISO-8859-1
Ext.define(	'AppAnest.view.person.LegalEntityController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.legalentity',

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
            'legalentitylist': {
            },
            'legalentityview': {
                afterrender: 'onAfterRenderView'
            },
            'legalentityview portrait filefield': {
                loadend: 'onLoadEnd'
            },
            'legalentityview gridpanel[name=phone]': {
                select: 'onSelectPhone'
            }
        }
    },

    routes: {
        'legalentityview/:id': {
            action: 'getLegalEntityId'
        },
        'legalentityview': {
            action: 'getLegalEntityNew'
        }
    },

    url: 'business/Class/legalentity.php',

    getUserCardIndex: function (btn) {
        var me = this,
            listViews = me.lookupReference('listViews');
        listViews.getLayout().setActiveItem(btn.cardIndex);
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('legalentityview');
    },

    getLegalEntityNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'legalentityview', xdata: null});
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
        phoneForm.down('comboenum[name=linetypedescription]').focus(false, 200);
        btn.up('personphone').down('gridpanel[name=phone]').getSelectionModel().deselectAll();
    },

    updatePhone: function (btn) {
        var me = this,
            view = btn.up('legalentityview'),
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
            view = btn.up('legalentityview'),
            portrait = me.lookupReference('portrait'),
            phoneForm = me.lookupReference('phoneForm');

        phoneForm.down('hiddenfield[name=id]').setDisabled(true);

        me.setModuleData('legalentity');
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
            view = btn.up('legalentityview'),
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
        var store = Ext.getStore('legalentity');

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
        me.redirectTo( 'legalentityview/' + record.get('id'));
    },

    getLegalEntityId: function (id) {
        var me = this,
            app = AppAnest.app.getController('App'),
            record = Ext.getStore('legalentity').findRecord('id',id);
        app.addToMainCenterRegion({xtype: 'legalentityview', xdata: record});
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            portrait = form.down('portrait'),
            store = Ext.getStore('legalentity'),
            id = form.down('hiddenfield[name=id]').getValue(),
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
        //form.down('contractorsearch[name=parentname]').setReadOnlyColor(id.lenght != 0);
    }

});