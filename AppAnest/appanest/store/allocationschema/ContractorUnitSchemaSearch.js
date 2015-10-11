Ext.define( 'AppAnest.store.allocationschema.ContractorUnitSchemaSearch', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorUnitSchemaSearch',

    storeId: 'contractorunitschemasearch',

    url: 'business/Class/contractorunitschema.php',

    model: 'AppAnest.model.allocationschema.ContractorUnitSchema',

    config: {
        extraParams: {
            action: 'select',
            method: 'selectLike',
            params: Ext.encode(['shortname']),
            fields: Ext.encode(['id','shortname','contractorunitid','schedulingperiodid','contractorsubunitid','subunitdescription'])
        }
    }

});