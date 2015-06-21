//@charset ISO-8859-1
Ext.define( 'AppAnest.view.users.UsersView', {
    extend: 'Ext.container.Container',
    
    xtype: 'usersview',

    requires: [
        'Ext.tab.*'
    ],

    controller: 'users',

    padding: 10,

    layout: {
        type: 'fit'
    },
    
    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                frame: true,
                xtype: 'panel',

                bodyStyle: 'padding: 30px 10px 10px 10px;',

                glyph: 0xe80d,

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                header: {
                    title: 'Cadastro do usuário',
                    items: [
                        {
                            xtype: 'button',
                            glyph: 0xeb4e,
                            handler: 'onHistoryBack'
                        }
                    ]
                },

                items: [
                    {
                        flex: 1,
                        xtype: 'container'
                    }, {
                        width: 600,
                        xtype: 'form',
                        layout: 'border',
                        items: [
                            {
                                region: 'center',
                                xtype: 'panel',
                                layout: 'border',
                                items: [
                                    {
                                        height: 250,
                                        region: 'north',
                                        xtype: 'panel',
                                        layout: 'border',
                                        items: [
                                            {
                                                width: 150,
                                                layout: 'border',
                                                region: 'west',
                                                xtype: 'panel',
                                                items: [
                                                    {
                                                        height: 200,
                                                        region: 'north',
                                                        xtype: 'portrait',
                                                        tableName: 'users',
                                                        fileImage: 'users',
                                                        reference: 'portrait'
                                                    }, {
                                                        region: 'center',
                                                        xtype: 'panel'
                                                    }
                                                ]
                                            }, {
                                                width: 20,
                                                region: 'west',
                                                xtype: 'panel'
                                            }, {
                                                layout: 'anchor',
                                                region: 'center',
                                                xtype: 'panel',
                                                defaultType: 'textfield',
                                                defaults: {
                                                    anchor: '100%'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'hiddenfield',
                                                        name: 'id'
                                                    }, {
                                                        anchor: '40%',
                                                        readOnlyColor: false,
                                                        fieldLabel: 'Usuário',
                                                        name: 'username'
                                                    }, {
                                                        fieldLabel: 'Nome completo',
                                                        name: 'fullname'
                                                    }, {
                                                        vtype: 'email',
                                                        name: 'mainmail',
                                                        fieldLabel: 'E-mail principal'
                                                    }, {
                                                        anchor: '40%',
                                                        name: 'birthdate',
                                                        xtype: 'datefield',
                                                        plugins: 'textmask',
                                                        fieldLabel: 'Nascimento'
                                                    }, {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                name: 'isactive',
                                                                xtype: 'checkboxfield',
                                                                boxLabel: 'Ativo'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                name: 'notifyuser',
                                                                xtype: 'checkboxfield',
                                                                boxLabel: 'Recebe notificações'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }, {
                                        region: 'center',
                                        xtype: 'tabpanel',
                                        deferredRender: false,
                                        ui: 'navigation',
                                        tabBar: {
                                            layout: {
                                                pack: 'center'
                                            }
                                        },
                                        items: [
                                            {
                                                glyph: 0xe860,
                                                title: 'Grupo de Acesso'
                                            }, {
                                                glyph: 0xe859,
                                                title: 'Menus de Acesso'
                                            }
                                        ]
                                    }
                                ]
                            }, {
                                region: 'south',
                                xtype: 'panel',
                                buttonAlign: 'center',
                                style: {
                                    borderTop: 'solid 1px #cecece'
                                },
                                buttons: [
                                    {
                                        glyph: 0xe86c,
                                        text: 'Salvar',
                                        showSmartTheme: 'red',
                                        handler: 'updateView'
                                    }, {
                                        glyph: 0xe875,
                                        text: 'Novo',
                                        showSmartTheme: 'red',
                                        handler: 'insertView'
                                    }, {
                                        glyph: 0xe869,
                                        text: 'Voltar',
                                        showSmartTheme: 'green',
                                        handler: 'onHistoryBack'
                                    }
                                ]
                            }
                        ]
                    }, {
                        flex: 1,
                        xtype: 'container'
                    }
                ]
            }
        ]
    }
    
});


