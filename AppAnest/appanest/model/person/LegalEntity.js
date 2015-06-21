Ext.define( 'AppAnest.model.person.LegalEntity', {
    extend: 'AppAnest.model.person.Person',

    classFields: [
        {
            name: 'type',
            type: 'auto',
            critical: true,
            defaultValue: 'L'
        }, {
            name: 'cnpjnumber',
            type: 'auto'
        }, {
            name: 'countyregistration',
            type: 'auto'
        }, {
            name: 'maincontact',
            type: 'auto'
        }
    ]

});