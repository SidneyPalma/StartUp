//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.SchedulingPlanningController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.schedulingplanning',

    onChangeFilter: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            store = me.lookupReference('schedulingplanning').getStore();

        store.clearFilter();
        store.filter('contractorunit',newValue);
    },

    onSchemaSave: function () {
        var me = this,
            list = [],
            store = me.lookupReference('schedulingplanning').getStore();

        store.each(function(record,index) {
            list.push(record.data);
        },me);

        console.info(Ext.encode(list));
    },

    onLoadWeek: function () {
        var me = this,
            view = me.getView(),
            panel = me.lookupReference('schedulingplanning'),
            store = panel.getStore();

        view.setLoading('Processando ...');

        store.removeAll();

        store.setParams({
            action: 'select',
            method: 'selectSheddule'
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                view.setLoading(false);
                panel.updateLayout();
                panel.refreshScroll();
                panel.getView().refresh();
                //panel.getSelectionModel().select(0);
            }
        });

    },

    selectAllocationSchema: function(combo, record, eOpts) {
        var me = this,
            fieldName = combo.updateField,
            sm = me.lookupReference('schedulingplanning').getSelectionModel(),
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
    }

});