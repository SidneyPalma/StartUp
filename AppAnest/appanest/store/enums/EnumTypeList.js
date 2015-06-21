//@charset ISO-8859-1
Ext.define( 'AppAnest.store.enums.EnumTypeList', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.EnumTypeList',

    storeId: 'enumtypelist',

    url: 'business/Class/enumtypelist.php',

    model: 'AppAnest.model.enums.EnumTypeList',

    pageSize: 10

    //config: {
    //    extraParams: {
    //        params: Ext.encode(['enumtypeid'])
    //    }
    //}

});