//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.Contractor', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.Contractor',

    storeId: 'contractor',

    model: 'AppAnest.model.person.Contractor',

    url: 'business/Class/contractor.php',

    config: {
        extraParams: {
            params: Ext.encode(['name','shortname']),
            fields: Ext.encode(['id','name','shortname','filedata','fileinfo','cnesnumber','isactive'])
        }
    }

});