//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.MapPlanning', {
    extend: 'Ext.container.Container',

    xtype: 'mapplanning',

    requires: [
        'Smart.form.field.*',
        'Ext.form.RadioGroup',
        'AppAnest.view.period.PeriodSearch'
    ],

    controller: 'mapplanning',

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

                glyph: 0xe93d,

                bodyStyle: 'padding: 30px 10px 10px 10px;',

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                header: {
                    title: 'Gerar Mapa',
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
                        width: 300,
                        region: 'west',
                        xtype: 'form',
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },
                        items: [
                            {
                                fieldLabel: 'Período',
                                xtype: 'periodsearch'
                            }
                        ]
                    }, {
                        region: 'center'
                    }
                ]
            }
        ]
    }

});