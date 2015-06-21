Ext.define( 'Smart.view.main.MainComment', {
    extend: 'Ext.window.Window',

    xtype: 'maincomment',

    controller: 'main',

    modal: true,

    layout: 'fit',

    title: 'Editar campos',

    width: 400,

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function ()  {
        var me = this,
            isId = me.xdata.get('COLUMN_NAME').toLowerCase(),
            fields = [
                {
                    fieldLabel: 'Descrição',
                    name: 'COMMENT_DESCRIPTION'
                }
            ];

        if (isId == 'id' ) {
            fields.push({
                xtype: 'combobox',
                editable: false,
                name: 'STRATEGY_TYPE',
                fieldLabel: 'Estrategia',
                displayField: 'STRATEGY_TYPE',
                valueField: 'STRATEGY_TYPE',
                store: {
                    xtype: 'store',
                    pageSize: 0,
                    fields: [ 'STRATEGY_TYPE' ],
                    data: [
                        { STRATEGY_TYPE: 'AUTO' },
                        { STRATEGY_TYPE: 'NONE' }
                    ]
                }
            });
        }

        me.items = [
            {
                xtype: 'form',
                padding: 10,
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: fields
            }
        ]
    },

    buttonAlign: 'center',

    buttons: [
        {
            text: 'Confirmar',
            handler: 'changeFields'
        }, {
            text: 'Limpar',
            handler: 'resetFields'
        }, {
            text: 'Cancelar',
            handler: 'doClose'
        }
    ]

});