Ext.define( 'AppAnest.model.contract.Additive', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'note',
            type: 'auto'
        }, {
            name: 'additivenumber',
            type: 'auto'
        }, {
            name: 'contractid',
            type: 'int'
        }, {
            name: 'description',
            type: 'auto'
        }, {
            name: 'additivestatus',
            type: 'auto'
        }, {
            name: 'additivestatusdescription',
            type: 'auto'
        }, {
            name: 'datesign',
            type: 'auto'
        }, {
            name: 'periodof',
            type: 'auto'
        }, {
            name: 'periodto',
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
        { type: 'presence', field: 'additivenumber' }
    ]

});