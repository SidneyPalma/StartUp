Ext.define( 'AppAnest.model.person.ContractorUnit', {
    extend: 'AppAnest.model.person.Person',

    classFields: [
        {
            name: 'type',
            type: 'auto',
            critical: true,
            defaultValue: 'U'
        }, {
            name: 'cnpjnumber',
            type: 'auto'
        }, {
            name: 'countyregistration',
            type: 'auto'
        }, {
            name: 'maincontact',
            type: 'auto'
        }, {
            name: 'parentname',
            type: 'auto'
        }
    ]

});