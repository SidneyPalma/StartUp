//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.NaturalPerson', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.NaturalPerson',

    storeId: 'naturalperson',

    model: 'AppAnest.model.person.NaturalPerson',

    url: 'business/Class/naturalperson.php',

    config: {
        extraParams: {
            params: Ext.encode(['name','shortname']),
            fields: Ext.encode(['id','name','shortname','filedata','fileinfo','cnesnumber','isactive'])
        }
    }

});