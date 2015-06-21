Ext.define( 'AppAnest.model.users.UsersMenu', {
    extend: 'Ext.data.TreeModel',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'parentid', type: 'int' },
        { name: 'text', type: 'auto' },
        { name: 'router', type: 'auto' },
        { name: 'glyph', type: 'auto' }
    ]

});