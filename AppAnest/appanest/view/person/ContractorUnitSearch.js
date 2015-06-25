//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorUnitSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.contractorunitsearch',

    store: 'AppAnest.store.person.ContractorUnit',

    valueField: 'shortname',
    displayField: 'shortname',

    pageSize: 0,

    lazyRender: true,
    selectOnTab: true,

    hideTrigger: true,
    matchFieldWidth: false,

    listConfig: {
        width: 150
    },

    listeners: {
        select: 'selectContractorUnit',
        change: 'changeContractorUnit'
    }

});
