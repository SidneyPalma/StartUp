//@charset ISO-8859-1
Ext.define( 'AppAnest.store.enums.EnumType', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.EnumType',

    storeId: 'enumtype',

    url: 'business/Class/enumtype.php',

    config: {
        extraParams: {
            params: Ext.encode(['name','description'])
        }
    },

    model: 'AppAnest.model.enums.EnumType'

});