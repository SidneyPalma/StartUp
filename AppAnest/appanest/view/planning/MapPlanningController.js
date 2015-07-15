//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.MapPlanningController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.mapplanning',

    onFilterWeekDay: function ( queryPlan, eOpts ) {
        var combo = queryPlan.combo,
            store = combo.store;

        store.clearFilter();
        store.filter('weekday',/(^mon)|(^tue)|(^wed)|(^thu)|(^fri)/);
    },

    onSelectWeekDay: function ( combo, record, eOpts ) {
        var me = this,
            view = me.getView(),
            positioncute = view.down('numberfield[name=positioncute]'),
            store = me.lookupReference('contractorunitlist').getStore();

        store.setParams({
            action: 'select',
            method: 'selectList',
            weekday: record.get('weekday')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var recNew = store.findRecord('position',positioncute.getValue());
                recNew.set('positioncute',1);
                recNew.commit();
                positioncute.setMaxValue(store.getCount());
            }
        });
    },

    onChangeCute: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            grid = me.lookupReference('contractorunitlist'),
            store = grid.getStore(),
            recOld = store.findRecord('position',oldValue),
            recNew = store.findRecord('position',newValue);

        if(recNew && recOld) {
            recOld.set('positioncute',0);
            recOld.commit();
            recNew.set('positioncute',1);
            recNew.commit();
        }
    },

    onRenderGridUnit: function ( grid, eOpts ) {
        var me = this,
            view = me.getView(),
            store = grid.getStore(),
            positioncute = view.down('numberfield[name=positioncute]');

        store.setParams({
            action: 'select',
            method: 'selectList'
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var recNew = store.findRecord('position',positioncute.getValue());
                if(recNew) {
                    recNew.set('positioncute',1);
                    recNew.commit();
                }
                positioncute.setMaxValue(store.getCount());
            }
        });
    }

});