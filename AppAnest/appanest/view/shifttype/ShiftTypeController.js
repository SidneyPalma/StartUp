Ext.define( 'AppAnest.view.enums.ShiftTypeController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.shifttype',

    stores: [
        'AppAnest.store.shifttype.*'
    ],

    models: [
        'AppAnest.model.shifttype.*'
    ],

    views: [
        'AppAnest.view.shifttype.*',
        'Smart.form.field.SmartTimeField'
    ],

    config: {
        control: {
            'shifttypeview': {
                afterrender: 'onAfterRenderView'
            },
            'shifttypeview radiofield[inputValue=I]': {
                change: 'onChangeDutyType'
            },
            'shifttypeview smarttimefield[name=validityof]': {
                change: function (field) {
                    console.info(field);
                }
            }
        }
    },

    routes: {
        'shifttypeview/:id': {
            action: 'getShiftTypeId'
        },
        'shifttypeview': {
            action: 'getShiftTypeNew'
        }
    },

    url: 'business/Class/shifttype.php',

    onSearchClick: function (search, button) {
        var store = Ext.getStore('shifttype');

        store.setParams({
            field: 'hours',
            query: search.getValue()
        }).load();
    },

    onViewEdit: function (btn) {
        var me = this,
            record = btn.getWidgetRecord();
        me.redirectTo( 'shifttypeview/' + record.get('id'));
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('shifttypeview');
    },

    getShiftTypeNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'shifttypeview', xdata: null});
    },

    getShiftTypeId: function (id) {
        var app = AppAnest.app.getController('App'),
            record = Ext.getStore('shifttype').findRecord('id',id);

        app.addToMainCenterRegion({xtype: 'shifttypeview', xdata: record});
    },

    updateView: function (btn) {
        var me = this,
            view = btn.up('shifttypeview');

        me.setModuleData('shifttype');
        me.setModuleForm(view.down('form'));

        me.updateModule();
    },

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            store = Ext.getStore('shifttype');

        if(!container.xdata) return false;

        store.setParams({
            method: 'selectCode',
            rows: Ext.encode({ id: container.xdata.get('id') })
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                form.loadRecord(record);
                form.down('numberfield[name=hours]').setReadOnlyColor(record.get('dutytype') == 'I');
            }
        });
    },

    onChangeDutyType: function ( field, newValue, oldValue, eOpts ) {
        var hours = field.up('form').down('numberfield[name=hours]');
        hours.setReadOnlyColor(newValue);
        if(newValue) {
            hours.setValue(12);
        }
    },

    insertView: function (btn) {
        var hours = btn.up('form').down('numberfield[name=hours]');
        btn.up('form').reset();
        hours.setValue(12);
    }

});