Ext.define( 'Smart.form.field.ComboEnum', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.comboenum',

    params: {},
    fields: [],

    pageSize: 0,
    editable: false,
    fieldLabel: null,
    submitValue: false,

    url: 'business/Class/enumtype.php',

    config: {
        params: {
            action: 'select',
            method: 'selectEnum'
        }
    },

    valueField: null,
    displayField: null,

    buildCombo: function () {
        var me = this,
            hiddenNameId = me.name.replace('description','');

        me.params.method = 'selectEnum';
        me.params.type = hiddenNameId;
        me.hiddenNameId = hiddenNameId;
        me.fieldLabel = me.fieldLabel || me.name;
        me.valueField = me.valueField || hiddenNameId;
        me.displayField = me.displayField || me.name;
        me.fields.push(me.valueField,me.displayField);
    },

    initComponent: function () {
        var me = this;
        me.initConfig();
        me.buildCombo();
        me.callParent();
    }

});