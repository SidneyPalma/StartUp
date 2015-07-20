//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.SchedulingPlanningController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.schedulingplanning',

    onLoadWeek: function (btn) {
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

    //changeAllocationSchema: function ( field, newValue, oldValue, eOpts ) {
    //    //var me = this,
    //    //    sm = me.lookupReference('schedulingplanning').getSelectionModel(),
    //    //    rc = sm.getSelection()[0];
    //    //
    //    //if(newValue == null) {
    //    //    rc.set(field.updateField,null);
    //    //}
    //}

    onAllocationSchemaBeforeEdit: function (editor, context, eOpts) {
        var fieldName = context.field.replace('description',''),
            weekday = parseInt(context.record.get(fieldName));

        return weekday !== 0;
    }

});