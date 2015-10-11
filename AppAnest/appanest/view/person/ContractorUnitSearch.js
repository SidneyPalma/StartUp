//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorUnitSearch', {
    extend: 'Smart.form.field.ComboSearch',

    xtype: 'contractorunitsearch',

    store: 'AppAnest.store.person.ContractorUnit',

    config: {
        shift: 'T'
    },

    valueField: 'shortname',
    displayField: 'shortname',

    pageSize: 0,

    lazyRender: true,
    selectOnTab: true,
    hideTrigger: true,
    enableKeyEvents: true,

    matchFieldWidth: false,

    listConfig: {
        width: 150
    },

    listeners: {
        select: 'selectContractorUnit',
        change: 'changeContractorUnit',
        beforequery: function ( queryPlan, eOpts ) {
            var shift = queryPlan.combo.getShift();
            queryPlan.cancel = ( shift == 'P' );
        },
        keypress: function(field, e) {
            var shift = field.getShift(),
                lists = [48,49,50,51,52,53,54,55,56,57];
            if((shift == 'P')&&(lists.indexOf(e.getKey()) == -1)) {
                e.stopEvent();
            }
        }
    }

});
