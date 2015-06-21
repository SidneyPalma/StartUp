//@charset ISO-8859-1
Ext.define( 'Smart.home.HomeForgot', {
    extend: 'Ext.container.Container',
    
    xtype: 'homeforgot',

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
                html: '<div style="line-height: 60px; color: white;" class="login-title">Esqueci minha senha</div>'
            }, {
                xtype: 'form',
                padding: 20,
                height: 430,
                width: '100%',
                layout: 'anchor',
                name: 'forgot',
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
                        html: '<div style="line-height: 50px; font-size: 24px;" class="message">Resetar minha senha</div>'
                    }, {
                        name: 'username',
                        emptyText: 'Usuário',
                        cls: 'username'
                    }, {
                        name: 'birthdate',
                        xtype: 'datefield',
                        plugins: 'textmask',
                        cls: 'birthdate'
                    }, {
                        name: 'mainmail',
                        vtype: 'email',
                        emptyText: 'E-mail',
                        cls: 'mainmail'
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
                                name: 'forgot',
                                xtype: 'button',
                                text: 'Enviar',
                                scale: 'medium',
                                glyph: 0xe806,
                                showSmartTheme: 'red'
                            }
                        ]
                    }, {
                        cls: 'message',
                        xtype: 'container',
                        html: [
                            '<div style="line-height:120px; font-size: 14px;" class="login-footer">',
                            '<a style="cursor:pointer;" class="comein">Voltar...</a>',
                            '</div>'
                        ],
                        listeners: {
                            render: function (component, eOpts) {
                                var homeforgot = component.up('homeforgot');
                                var comein = component.getEl().query('.comein');
                                var el = Ext.get(comein[0]);
                                el.on("click", function () {
                                    homeforgot.fireEvent('logincomein',homeforgot);
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