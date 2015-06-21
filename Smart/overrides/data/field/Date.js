Ext.define( 'Ext.overrides.data.field.Date', {
    override: 'Ext.data.field.Date',

    maskRe: /[0-9\/]/,
    dateReadFormat : 'd/m/Y',
    dateWriteFormat: 'Y-m-d'

});