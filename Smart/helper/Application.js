Ext.define( 'Smart.Application', {
    extend: 'Ext.app.Application',
    
    name: 'Smart',

    stores: [
        // TODO: add global / shared stores here
    ],

    init: function () {
        var me = this;
        me.initQuickTips();
        Ext.USE_NATIVE_JSON = true;
        Ext.setGlyphFontFamily('fontello');
    },

    launch: function () {
    }
});
