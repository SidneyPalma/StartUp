Ext.define( 'AppAnest.store.person.ContractorUnitSchema', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorUnitSchema',

    storeId: 'contractorunitschema',

    url: 'business/Class/contractorunitschema.php',

    model: 'AppAnest.model.person.ContractorUnitSchema',

    groupField: 'shiftdescription'

});