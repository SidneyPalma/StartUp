Ext.define( 'AppAnest.model.users.Users', {
    extend: 'Ext.data.Model',

    requires: [
        'Smart.Resource'
    ],

    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'username',
            type: 'auto'
        }, {
            name: 'password',
            type: 'auto'
        }, {
            name: 'fullname',
            type: 'auto'
        }, {
            name: 'mainmail',
            type: 'auto'
        }, {
            name: 'isactive',
            type: 'bool'
        }, {
            name: 'birthdate',
            type: 'auto'
        }, {
            name: 'notifyuser',
            type: 'bool'
        }, {
            name: 'filedata',
            type: 'auto',
            convert: function (value,record) {
                return (value) ? value : Smart.Resource.getFileImage('users');
            }
        }, {
            name: 'fileinfo',
            type: 'auto'
        }, {
            name: 'filetype',
            type: 'auto',
            convert: function (value,record) {
                var info = record.get('fileinfo'),
                    type = (info && info.length !== 0) ? Ext.decode(info) : null;
                return (type) ? Ext.String.format('data:{0};base64,{1}',type.fileType,record.get('filedata')) : record.get('filedata');
            }
        }
    ],

    business: [
        { type: 'presence', field: 'username' },
        { type: 'presence', field: 'fullname' },
        { type: 'presence', field: 'mainmail' },
        { type: 'presence', field: 'birthdate' },
        { type: 'length', field: 'username', min: 6, max: 30 },
        { type: 'length', field: 'fullname', min: 6, max: 80 }
    ]

});