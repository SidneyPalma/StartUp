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
        }, {
            name: 'position',
            type: 'int'
        }, {
            name: 'positionmon',
            type: 'int'
        }, {
            name: 'positiontue',
            type: 'int'
        }, {
            name: 'positionwed',
            type: 'int'
        }, {
            name: 'positionthu',
            type: 'int'
        }, {
            name: 'positionfri',
            type: 'int'
        }
    ]

});