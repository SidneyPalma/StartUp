//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.LegalEntity', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.LegalEntity',

    storeId: 'legalentity',

    model: 'AppAnest.model.person.LegalEntity',

    url: 'business/Class/legalentity.php',

    config: {
        extraParams: {
            params: Ext.encode(['name','shortname']),
            fields: Ext.encode(['id','name','shortname','filedata','fileinfo','cnesnumber','isactive'])
        }
    }

});