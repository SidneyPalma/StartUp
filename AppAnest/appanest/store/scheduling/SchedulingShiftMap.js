Ext.define( 'AppAnest.store.scheduling.SchedulingShiftMap', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.SchedulingShiftMap',

    storeId: 'schedulingshiftmap',

    url: 'business/Class/additiveshift.php',

    model: 'AppAnest.model.scheduling.SchedulingShiftMap'

});