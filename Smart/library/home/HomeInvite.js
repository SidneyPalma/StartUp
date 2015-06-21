//@charset ISO-8859-1
Ext.define( 'Smart.home.HomeInvite', {
    extend: 'Ext.container.Container',
    
    xtype: 'homeinvite',

    layout: 'vbox',
    
    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },
    
    buildItems: function () {
        var me = this;
                
        me.items = [
            {
                height: 60,
                width: '100%',
                xtype: 'container',
                html: '<div style="line-height: 60px; color: white;" class="login-title">Registrar convite</div>'
            }, {
                xtype: 'form',
                padding: 20,
                height: 430,
                width: '100%',
                layout: 'anchor',
                name: 'invite',
                cls: 'content',
                bodyStyle: 'background: transparent !important;',
                plugins: [
                    {
                        ptype: 'formenter'
                    }
                ],
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                    {
                        height: 70,
                        name: 'message',
                        xtype: 'container',
                        html: '<div style="line-height: 50px; font-size: 24px;" class="message">Confirmar meu convite</div>'
                    }, {
                        name: 'username',
                        xtype: 'textfield',
                        emptyText: 'Usuário',
                        cls: 'username'
                    }, {
                        name: 'password',
                        vtype: 'alphanum',
                        inputType: 'password',
                        emptyText: '...minha nova senha!',
                        cls: 'password'
                    }, {
                        name: 'invite',
                        emptyText: 'Meu convite',
                        cls: 'invite'
                    }, {
                        xtype: 'container',
                        height: 10
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                flex: 2,
                                xtype: 'container'
                            }, {
                                flex: 1,
                                name: 'invite',
                                xtype: 'button',
                                text: 'Enviar',
                                scale: 'medium',
                                glyph: 0xe806,
                                showSmartTheme: 'green'
                            }
                        ]
                    }, {
                        height: 120,
                        cls: 'message',
                        xtype: 'container',
                        html: [
                            '<div style="line-height: 120px; font-size: 14px;" class="login-footer">',
                            '<a style="cursor:pointer;" class="comein">Voltar...</a>',
                            '</div>'
                        ],
                        listeners: {
                            render: function (component, eOpts) {
                                var homeinvite = component.up('homeinvite');
                                var comein = component.getEl().query('.comein');
                                var el = Ext.get(comein[0]);
                                el.on("click", function () {
                                    homeinvite.fireEvent('logincomein',homeinvite);
                                });

                            }
                        }
                    }, {
                        height: 20,
                        cls: 'message',
                        xtype: 'container',
                        html: '<div style="line-height: 20px; text-align: center;" class="login-footer">2015 © Optimal Automação e Soluções Ltda.</div>'
                    }
                ]
            }
        ];
    }
    
});