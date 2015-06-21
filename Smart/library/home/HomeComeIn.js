//@charset ISO-8859-1
Ext.define( 'Smart.home.HomeComeIn', {
    extend: 'Ext.container.Container',

    xtype: 'homecomein',

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
                name: 'title',
                xtype: 'container',
                html: '<div style="line-height: 60px;" class="login-title">AppAnest</div>'
            }, {
                xtype: 'form',
                padding: 20,
                height: 430,
                width: '100%',
                layout: 'anchor',
                name: 'comein',
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
                        html: '<div style="line-height: 50px; font-size: 24px;" class="message">Entre na sua conta</div>'
                    }, {
                        name: 'username',
                        emptyText: 'Usuário',
                        cls: 'username'
                    }, {
                        name: 'password',
                        vtype: 'alphanum',
                        inputType: 'password',
                        emptyText: 'Senha',
                        cls: 'password'
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
                                name: 'comein',
                                xtype: 'button',
                                text: 'Entrar',
                                scale: 'medium',
                                glyph: 0xe89a,
                                showSmartTheme: 'login'
                            }
                        ]
                    }, {
                        cls: 'message',
                        xtype: 'container',
                        html: [
                            '<div style="height: 156px; line-height: 24px; font-size: 16px; padding-top: 52px;" class="login-footer">',
                            '<a style="font-size: 24px;">Esqueceu sua senha?</a><br/>',
                            'clique <a style="cursor:pointer; font-size: 16px; color: rgba(53,152,220,1);" class="forgot">aqui</a> para resetar sua senha.<br/>',
                            '<a style="cursor:pointer; color: rgba(53,152,220,1);" class="invite">Registre o seu convite.</a>',
                            '</div>'
                        ],
                        listeners: {
                            render: function (component, eOpts) {
                                var homecomein = component.up('homecomein');
                                forgot = component.getEl().query('.forgot')[0],
                                    invite = component.getEl().query('.invite')[0],
                                    forgotEl = Ext.get(forgot),
                                    inviteEl = Ext.get(invite);

                                forgotEl.on("click", function () {
                                    homecomein.fireEvent('loginforgot',homecomein);
                                });
                                inviteEl.on("click", function () {
                                    homecomein.fireEvent('logininvite',homecomein);
                                });

                                homecomein.down('textfield[name=username]').focus(true, 50);

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
        ]
    },

    setConfigTitle: function (title) {
        var me = this;

        me.down('container[name=title]').update('<div style="line-height: 60px; color: white;" class="login-title">' + title + '</div>');
    }

});
