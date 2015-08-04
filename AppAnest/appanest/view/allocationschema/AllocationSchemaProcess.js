//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchemaProcess', {
    extend: 'Ext.window.Window',

    xtype: 'allocationschemaprocess',

    requires: [

    ],

    title: 'Processar Escala do Periodo Selecionado',

    glyph: 0xec2b,

    modal: true,

    controller: 'allocationschema',

    width: 600,

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
                xtype: 'form',
                layout: 'anchor',
                defaults: {
                    anchor: '100%',
                    useMondaFont: true
                },
                items: [
                    {
                        width: 250,
                        fieldLabel: 'Periodo',
                        readOnlyColor: true,
                        xtype: 'textfield',
                        name: 'period',
                        fieldStyle: {
                            color: 'blue;',
                            fontSize: '16px;'
                        }
                    }, {
                        xtype: 'hiddenfield',
                        name: 'periodid'
                    }, {
                        height: 300,
                        title: 'Tratar Pré-Processamento',
                        xtype: 'panel',
                        layout: 'fit',
                        items: [
                            {
                                plain: true,
                                ui: 'navigation-items',
                                xtype: 'tabpanel',
                                items: [
                                    {
                                        glyph: 0xe8f5,
                                        title: 'Diurno'
                                        //xtype: 'container'
                                    }, {
                                        glyph: 0xec6e,
                                        title: 'Noturno'
                                        //xtype: 'container'
                                    }, {
                                        glyph: 0xec2c,
                                        title: 'SubUnidades'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

});