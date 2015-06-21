Ext.define( 'AppAnest.view.main.Main', {
    extend: 'Ext.panel.Panel',

    xtype: 'main',
    
    controller: 'main',

    requires: [
        'Smart.home.Home',
        'AppAnest.view.main.MainDock',
        'AppAnest.view.main.MainTool'
    ],

    layout: {
        type: 'border'
    },

    cls: 'wallpaper12',

    items: [
        {
            height: 50,
            region: 'north',
            xtype: 'maindock'
        }, {
            width: 250,
            region: 'west',
            xtype: 'maintool'
        }, {
            layout: 'fit',
            region: 'center',
            xtype: 'home'
        }
    ]

});