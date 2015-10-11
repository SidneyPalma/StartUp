Ext.define( 'AppAnest.store.allocationschema.ContractorUnitSchemaShow', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorUnitSchemaShow',

    storeId: 'contractorunitschemashow',

    url: 'business/Class/contractorunitschema.php',

    model: 'AppAnest.model.allocationschema.ContractorUnitSchema',

    groupField: 'shiftdescription'

});