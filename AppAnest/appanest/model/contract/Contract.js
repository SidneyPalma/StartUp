Ext.define( 'AppAnest.model.contract.Contract', {
    extend: 'Ext.data.Model',

    requires: [
        'Smart.TextMaskCore'
    ],

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'additivelist',
            type: 'auto'
        }, {
            name: 'legalentity',
            type: 'auto'
        }, {
            name: 'contractor',
            type: 'auto'
        }, {
            name: 'contractnumber',
            type: 'auto'
        }, {
            name: 'legalentityid',
            type: 'int'
        }, {
            name: 'contractorid',
            type: 'int'
        }, {
            name: 'cnpjnumber',
            type: 'auto'
        }, {
            name: 'observation',
            type: 'auto'
        }, {
            name: 'isactive',
            type: 'bool'
        }, {
            name: 'contractdate',
            type: 'auto'
        }, {
            name: 'filedata',
            type: 'auto'
        }, {
            name: 'fileinfo',
            type: 'auto'
        }, {
            name: 'filetype',
            type: 'auto',
            convert: function (value,record) {
                var info = record.get('fileinfo'),
                    type = (info && info.length !== 0) ? Ext.decode(info) : null;
                return (type) ? Ext.String.format('data:{0};base64',type.fileType) : type;
            }
        }
    ],

    business: [
        { type: 'presence', field: 'legalentityid' },
        { type: 'presence', field: 'contractorid' }
    ]

});