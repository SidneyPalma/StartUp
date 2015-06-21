Ext.define(	'AppAnest.Application', {
    extend: 'Ext.app.Application',

    name: 'AppAnest',

    stores: [
        // TODO: add global / shared stores here
    ],

    controllers: [
        'App'
    ],

    init: function () {
        var me = this;
        me.initQuickTips();
        me.setDefaultToken('home');
        Ext.USE_NATIVE_JSON = true;
        Ext.setGlyphFontFamily('fontello');
    },

    launch: function () {
        window.location.hash = "#home";
        Ext.getBody().getById('loading').hide();
    }

});
