Ext.define( 'AppAnest.store.contract.ContractData', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.ContractData',

    storeId: 'contractdata',

    url: 'business/Class/contractdata.php',

    model: 'AppAnest.model.contract.ContractData'

});