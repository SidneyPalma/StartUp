//@charset ISO-8859-1
Ext.define( 'Smart.fields.MaskZipCode', {
    extend: 'Ext.form.field.Text',

    alias: 'widget.maskzipcode',

    requires: [
        'Smart.plugins.TextMask'
    ],

    money: false,
    plugins: 'textmask',
    mask: '99.999-999'

});