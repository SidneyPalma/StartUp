Ext.define( 'Ext.overrides.form.Label', {
    override: 'Ext.form.Label',

    labelAlign: 'top',
    labelSeparator: '',

    afterRender: function () {
        var me = this,
            eOpts = {},
            el = me.getEl();

        el.on('click', function(){ me.fireEvent('click', me, el, eOpts); }, me);
    }

});