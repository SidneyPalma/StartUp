//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.PublishSchedule', {
    extend: 'Ext.window.Window',

    xtype: 'publishschedule',

    requires: [],

    controller: 'allocationschedule',

    title: 'Publicar Escala',

    width: 450,

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
                padding: 10,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        name: 'period',
                        fieldLabel: 'Competencia',
                        xtype: 'textfield',
                        readOnlyColor: true,
                        useMondaFont: true,
                        fieldStyle: {
                            color: 'blue;',
                            fontSize: '16px;'
                        }
                    }, {
                        name: 'periodid',
                        xtype: 'hiddenfield'
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Proxima competencia',
                        defaultType: 'checkboxfield',
                        defaults: {
                            checked: true,
                            readOnly: true
                        },
                        items: [
                            {
                                name: 'transportschema',
                                boxLabel: 'Transportar Esquema de Calculo'
                            }, {
                                name: 'transportmap',
                                boxLabel: 'Transportar Mapa Mensal'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    buttons: [
        {
            text: 'Confirmar',
            handler: 'startPublishSchedule'
        }, {
            text: 'Fechar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ]

});