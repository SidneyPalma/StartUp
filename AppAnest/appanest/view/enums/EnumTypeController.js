Ext.define( 'AppAnest.view.enums.EnumTypeController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.enumtype',

    stores: [
        'AppAnest.store.enums.*'
    ],

    models: [
        'AppAnest.model.enums.*'
    ],

    views: [
        'AppAnest.view.enums.*'
    ],

    config: {
        control: {
            'enumtypeview': {
                afterrender: 'onAfterRenderView'
            },
            'enumtypeview gridpanel': {
                select: 'onSelectEnumListItem'
            }
        }
    },

    routes: {
        'enumtypeview/:id': {
            action: 'getEnumTypeId'
        },
        'enumtypeview': {
            action: 'getEnumTypeNew'
        }
    },

    url: 'business/Class/enumtype.php',

    onSearchClick: function (search, button) {
        var store = Ext.getStore('enumtype');

        store.setParams({
            field: 'name',
            query: search.getValue()
        }).load();
    },

    onViewEdit: function (btn) {
        var me = this,
            record = btn.getWidgetRecord();
        me.redirectTo( 'enumtypeview/' + record.get('id'));
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('enumtypeview');
    },

    getEnumTypeNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'enumtypeview', xdata: null});
    },

    getEnumTypeId: function (id) {
        var app = AppAnest.app.getController('App'),
            record = Ext.getStore('enumtype').findRecord('id',id);

        app.addToMainCenterRegion({xtype: 'enumtypeview', xdata: record});
    },

    updateView: function (btn) {
        var me = this,
            view = btn.up('enumtypeview');

        me.setModuleData('enumtype');
        me.setModuleForm(view.down('form'));

        me.updateModule();
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            store = Ext.getStore('enumtype'),
            storeTypeList = form.down('gridpanel').store;

        if(!container.xdata) return false;

        store.setParams({
            method: 'selectCode',
            rows: Ext.encode({ id: container.xdata.get('id') })
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                form.loadRecord(record);
                storeTypeList.setParams({
                    query: record.get('id'),
                    method: 'selectCode'
                }).load();

                form.down('button[handler=updateView]').setDisabled(record.get('reserved') == true);
                form.down('textareafield[name=observation]').setReadOnlyColor(record.get('reserved') == true);

                var enumListForm = me.lookupReference('enumListForm');

                enumListForm.down('button[handler=updateEnumList]').setDisabled(record.get('reserved') == true);
                enumListForm.down('button[handler=insertEnumList]').setDisabled(record.get('reserved') == true);

                enumListForm.down('textfield[name=code]').setReadOnlyColor(record.get('reserved') == true);
                enumListForm.down('textfield[name=description]').setReadOnlyColor(record.get('reserved') == true);
                enumListForm.down('textareafield[name=observation]').setReadOnlyColor(record.get('reserved') == true);
            }
        });

    },

    onSelectEnumListItem: function (rowModel, record, index, eOpts ) {
        var me = this,
            enumListForm = me.lookupReference('enumListForm');

        enumListForm.loadRecord(record);
    },

    insertEnumList: function (btn) {
        var me = this,
            enumListForm = me.lookupReference('enumListForm');
        enumListForm.reset();
    },

    updateEnumList: function (btn) {
        var me = this,
            view = btn.up('enumtypeview'),
            id = view.down('hiddenfield[name=id]'),
            enumListForm = me.lookupReference('enumListForm'),
            url = 'business/Class/enumtypelist.php';

        enumListForm.down('hiddenfield[name=enumtypeid]').setValue(id.getValue());

        me.setModuleData('enumtypelist');
        me.setModuleForm(enumListForm);

        me._success = function () {
            me.insertEnumList(btn);
            view.down('gridpanel').store.load();
        }

        me.updateModule(null,url);
    }

});