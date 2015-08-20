//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationSchedule', {
    extend: 'Ext.container.Container',

    xtype: 'allocationschedule',

    requires: [
        'Ext.picker.Date',
        'Ext.layout.container.SegmentedButton',
        'AppAnest.view.period.PeriodSearch'
    ],

    controller: 'allocationschedule',

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
                xtype: 'form',

                glyph: 0xe9d7,

                padding: 10,

                layout: {
                    type: 'border'
                },
                header: {
                    title: 'Escala Mensal',
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
                        width: 250,
                        region: 'west',
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            {
                                region: 'north',
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%'
                                },
                                items: [
                                    {
                                        xtype: 'periodsearch',
                                        fieldStyle: {
                                            color: 'blue;',
                                            fontSize: '16px;'
                                        },
                                        listeners: {
                                            select: 'onSelectPeriod'
                                        }
                                    }, {
                                        xtype: 'datepicker',
                                        showToday: false
                                    }
                                ]
                            }, {
                                region: 'center',
                                layout: 'anchor',
                                items: [
                                    {
                                        width: '100%',
                                        margin: '10 0 0 0',
                                        xtype: 'segmentedbutton',
                                        defaults: {
                                            scale: 'large',
                                            showSmartTheme: 'sky',
                                            handler: 'getCardIndex'
                                        },
                                        items: [
                                            {
                                                cardIndex: 0,
                                                glyph: 0xe954
                                            }, {
                                                cardIndex: 1,
                                                glyph: 0xe899,
                                                pressed: true
                                            }, {
                                                cardIndex: 2,
                                                glyph: 0xe898
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }, {
                        region: 'center',
                        xtype: 'container',
                        layout: 'border',
                        items: [
                            {
                                region: 'north'
                            }, {
                                region: 'center'
                            }
                        ]
                    }
                ]
            }
        ]
    }

});