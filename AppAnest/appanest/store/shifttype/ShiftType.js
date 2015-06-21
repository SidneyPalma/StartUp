//@charset ISO-8859-1
Ext.define( 'AppAnest.store.shifttype.ShiftType', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ShiftType',

    storeId: 'shifttype',

    url: 'business/Class/shifttype.php',

    //config: {
    //    extraParams: {
    //        params: Ext.encode(['name','description'])
    //    }
    //},

    model: 'AppAnest.model.shifttype.ShiftType'

});