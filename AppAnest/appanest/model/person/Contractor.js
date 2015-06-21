Ext.define( 'AppAnest.model.person.Contractor', {
    extend: 'AppAnest.model.person.Person',

    fileImage: 'hospital',

    fields: [
        {
            name: 'type',
            type: 'auto',
            critical: true,
            defaultValue: 'C'
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