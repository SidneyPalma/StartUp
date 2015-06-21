Ext.define( 'Smart.store.Fields', {
    extend: 'Smart.data.StoreBase',

    url: 'helper/controller/handler/Helper.php',

    pageSize:  100,

    fields: [
        {
            name: 'ORDINAL_POSITION',
            type: 'auto',
            convert: function (value,record) {
                return Ext.String.leftPad(value, 2, '0');
            }
        }, {
            name: 'COLUMN_NAME',
            type: 'auto'
        }, {
            name: 'COLUMN_DEFAULT',
            type: 'auto'
        }, {
            name: 'DATA_TYPE',
            type: 'auto'
        }, {
            name: 'CHARACTER_MAXIMUM_LENGTH',
            type: 'auto'
        }, {
            name: 'IS_NULLABLE',
            type: 'auto'
        }, {
            name: 'HAS_POLICY',
            type: 'boolean',
            convert: function (value,record) {
                return record && record.data.COLUMN_NAME.toLowerCase() == 'id' ? false : value;
            }
        }, {
            name: 'HAS_IGNORE',
            type: 'boolean'
        }, {
            name: 'STRATEGY_TYPE',
            type: 'auto'
        }, {
            name: 'COMMENT_DESCRIPTION',
            type: 'auto'
        }
    ]

});