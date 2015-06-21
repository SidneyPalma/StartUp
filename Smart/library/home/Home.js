//@charset ISO-8859-1
Ext.define( 'Smart.home.Home', {
    extend: 'Ext.container.Container',

    xtype: 'home',
    
    requires: [
        'Smart.home.HomeComeIn',
        'Smart.home.HomeForgot',
        'Smart.home.HomeInvite',
        'Smart.plugins.FormEnter'
    ],

    layout: {
        type: 'vbox',
        align: 'center'
    },

    opened: true,

    showSmartTransparent: true,

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },
    
    buildItems: function () {
        var me = this;
        
        me.items = [
            {
                flex: 1,
                xtype: 'container'
            }, {
                xtype: 'container',
                hidden: me.opened,
                name: 'userlogin',
                width: 360,
                height: 467,
                layout: 'card',
                defaults: {
                    cls: 'theme-smart-login'
                },
                items: [
                    {
                        xtype: 'homecomein'
                    }, {
                        xtype: 'homeforgot'
                    }, {
                        xtype: 'homeinvite'
                    }
                ]
            }, {
                flex: 1,
                xtype: 'container'
            }
        ];
    },

    setAppDefaults: function (cfg) {
        var me = this,
            homecomein = me.down('homecomein');

        homecomein.setConfigTitle(cfg.title);
        //homecomein.setConfigMessage(cfg.message);
    }

});