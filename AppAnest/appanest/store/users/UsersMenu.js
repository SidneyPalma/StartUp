Ext.define( 'AppAnest.store.users.UsersMenu', {
    extend: 'Smart.data.TreeStoreBase',
	
    alias: 'store.UsersMenu',

    storeId: 'usersmenu',

    url: 'business/Class/users.php',
    model: 'AppAnest.model.users.UsersMenu',

    config: {
        extraParams: {
            params: Ext.encode([]),
            method: 'selectUserModule'
        }
    }

});