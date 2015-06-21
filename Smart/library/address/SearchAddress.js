//@charset ISO-8859-1
Ext.define( 'Smart.address.SearchAddress', {
    extend: 'Ext.window.Window',

    alias: 'widget.searchaddress',

    requires: [
        'Smart.ux.TextMaskCore'
    ],
    
    title: 'Pesquisar logradouros e localidades',

    width: 880,
    height: 620,
    
    glyph: 0xe804,

    modal: true,
    autoShow: true,
    layout: 'border',
    
    url: null,
    
    findedAddress: Ext.emptyFn,
    
    defaultFocus: 'search',

    addressSearch: function () {
        var me = this,
            store = me.down('gridpanel').getStore(),
            search = me.down('textfield[name=search]');

        store.load({
            params: {
                query: search.getValue(),
                action: 'buscarCep'
            }
        });
    },
    
    initComponent: function () {
    	var me = this;

        me.buttons = [
            {
                scope: me,
                text: 'Fechar',
                glyph: 0xe89b,
                handler: me.close,
                showSmartTheme: 'green'
            }
        ];
        
    	me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this,
            store = Ext.create('Ext.data.Store', {
                fields: [
                    { name: 'Localidade' },
                    { name: 'Logradouro' },
                    { name: 'Bairro' },
                    { name: 'CEP' },
                    { name: 'UF' }
                ],
                proxy: {
                    type: 'ajax',
                    url: me.url,
                    reader: {
                        type: 'json',
                        rootProperty: 'rows',
                        messageProperty: 'text',
                        totalProperty: 'records',
                        successProperty: 'success'
                    },
                    extraParams: {
                        query: '',
                        action: 'buscarCep',
                        rows: '{"id":"0"}'
                    },
                    actionMethods: { read: 'post' }
                }
            });
        
        me.items = [
            {
                region: 'north',
                bodyStyle: 'padding: 10px;',
                layout: 'hbox',
                items: [
                    {
                        flex: 1,
                        xtype: 'textfield',
                        name: 'search',
                        itemId: 'search',
                        fieldLabel: 'Buscar'
                    }, {
                        xtype: 'splitter'
                    }, {
                        scope: me,
                        xtype: 'button',
                        glyph: 0xe804,
                        scale: 'large',
                        margin: '12 0 0 0',
                        handler: me.addressSearch,
                        showSmartTheme: 'red'
                    }
                ]
            }, {
                region: 'center',
                items: [
                    {
                        xtype: 'gridpanel',
                        hideHeaders: false,
                        title: 'Resultados da pesquisa',
                        store: store,
                        columns: [
                            {
                                text: 'Logradouro',  
                                dataIndex: 'Logradouro', 
                                flex: 2 
                            }, { 
                                text: 'Bairro', 
                                dataIndex: 'Bairro', 
                                flex: 1 
                            }, { 
                                text: 'CEP', 
                                dataIndex: 'CEP', 
                                width: 110,
                                renderer: function (value, metaData, record) {
                                    return Smart.TextMask.setMask('99.999-999').mask(value);
                                }
                            }, {
                                text: 'Localidade', 
                                dataIndex: 'Localidade', 
                                width: 160, 
                                renderer: function (value, metaData, record) { 
                                    return record.get('Localidade') +'-'+ record.get('UF'); 
                                } 
                            }, {
                                width: 60,
                                align: 'center',
                                xtype: 'widgetcolumn',
                                widget: {
                                    xtype: 'button',
                                    glyph: 0xe86d,
                                    showSmartTheme: 'red',
                                    handler: function(btn) {
                                        var rec = btn.getWidgetRecord(),
                                            win = btn.getWidgetColumn().up('window');
                                        Ext.callback(win.findedAddress, win.scope, [win,rec]);
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];
    }
    
});