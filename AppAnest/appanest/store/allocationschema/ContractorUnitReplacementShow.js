Ext.define( 'AppAnest.store.allocationschema.ContractorUnitReplacementShow', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractorUnitReplacementShow',

    storeId: 'contractorunitreplacementshow',

    url: 'business/Class/contractorunitreplacement.php',

    model: 'AppAnest.model.allocationschema.ContractorUnitReplacement',

    groupField: 'shiftdescription'

});