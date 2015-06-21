//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.ContractorSubUnit', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorSubUnit',

    storeId: 'contractorsubunit',

    model: 'AppAnest.model.person.ContractorSubUnit',

    url: 'business/Class/contractorsubunit.php',

    config: {
        extraParams: {
            method: 'selectCode',
            fields: Ext.encode(['id','subunit','subunitdescription'])
        }
    }

});