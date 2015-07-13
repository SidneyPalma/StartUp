//@charset ISO-8859-1
Ext.define( 'AppAnest.store.scheduling.SchedulingPeriod', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.SchedulingPeriod',

    storeId: 'schedulingperiod',

    url: 'business/Class/schedulingperiod.php',

    model: 'AppAnest.model.scheduling.SchedulingPeriod',

    config: {
        extraParams: {
            params: Ext.encode(['month'])
        }
    }

});