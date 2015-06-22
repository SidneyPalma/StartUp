Ext.define( 'Ext.overrides.form.field.Base', {
    override: 'Ext.form.field.Base',

    msgTarget: 'qtip',
    labelAlign: 'top',
    labelSeparator: '',

    useMondaFont: false,
    readOnlyColor: false,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.setUseMondaFont(me.useMondaFont);

        if (me.getXType()== 'displayfield') {
            return false;
        }

        me.setReadOnlyColor(me.readOnlyColor || me.readOnly);
    },

    objectMerge: function (target, source) {
        var me = this;

        if ( typeof target !== 'object' ) {
            target = {};
        }

        for (var property in source) {

            if ( source.hasOwnProperty(property) ) {

                var sourceProperty = source[ property ];

                if ( typeof sourceProperty === 'object' ) {
                    target[ property ] = me.fieldStyleMerge( target[ property ], sourceProperty );
                    continue;
                }

                target[ property ] = sourceProperty;

            }

        }

        for (var a = 2, l = arguments.length; a < l; a++) {
            merge(target, arguments[a]);
        }

        return target;
    },

    setReadOnlyColor: function ( value ) {
        var me = this,
            fieldStyle = me.objectMerge(me.fieldStyle,{ 'background-color' : ( value === true ? '#FFFFCC' : '#FFFFFF' ) });

        me.setReadOnly(value);
        me.setFieldStyle(fieldStyle);
    },

    setUseMondaFont: function ( value ) {
        var me = this,
            fieldStyle = me.objectMerge(me.fieldStyle, ( value === true ? { 'font-family' : 'Monda' } : me.fieldStyle ));

        me.setFieldStyle(fieldStyle);
    }

});