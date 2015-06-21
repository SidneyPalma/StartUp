//@charset ISO-8859-1
Ext.define( 'AppAnest.store.users.Users', {
    extend: 'Smart.data.StoreBase',
	
    alias: 'store.Users',

    storeId: 'users',

    url: 'business/Class/users.php',

    config: {
        extraParams: {
            params: Ext.encode(['username','fullname'])
        }
    },

    model: 'AppAnest.model.users.Users'

    //fields: [
    //    {
    //        name: 'id',
    //        type: 'int'
    //    }, {
    //        name: 'username',
    //        type: 'auto',
    //        validators: [
    //            {
    //                type: 'presence'
    //            }
    //        ]
    //    }, {
    //        name: 'password',
    //        type: 'auto'
    //    }, {
    //        name: 'fullname',
    //        type: 'auto'
    //    }, {
    //        name: 'mainmail',
    //        type: 'auto'
    //    }, {
    //        name: 'isactive',
    //        type: 'bool'
    //    }, {
    //        name: 'filedata',
    //        type: 'auto'
    //    }, {
    //        name: 'fileinfo',
    //        type: 'auto'
    //    }, {
    //        name: 'birthdate',
    //        type: 'auto'
    //    }, {
    //        name: 'notifyuser',
    //        type: 'bool'
    //    }, {
    //        name: 'filetype',
    //        type: 'auto',
    //        convert: function (value,record) {
    //            var info = record.get('fileinfo'),
    //                type = (info && info.length !== 0) ? Ext.decode(info) : null;
    //            return (type) ? Ext.String.format('data:{0};base64',type.fileType) : type;
    //        }
    //    }
    //]

});