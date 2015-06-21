//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.ContractorUnit', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorUnit',

    storeId: 'contractorunit',

    model: 'AppAnest.model.person.ContractorUnit',

    url: 'business/Class/contractorunit.php',

    config: {
        extraParams: {
            params: Ext.encode(['name','shortname']),
            fields: Ext.encode(['id','name','shortname','filedata','fileinfo','cnesnumber','isactive'])
        }
    }

});