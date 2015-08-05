Ext.define( 'AppAnest.store.person.ContractorUnitSchemaShow', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorUnitSchemaShow',

    storeId: 'contractorunitschemashow',

    url: 'business/Class/contractorunitschema.php',

    model: 'AppAnest.model.person.ContractorUnitSchema',

    groupField: 'shiftdescription'

});