//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschema.AllocationSchemaMap', {
    extend: 'Ext.grid.Panel',

    xtype: 'allocationschemamap',

    name: 'schemaweekday',

    rowLines: false,
    autoScroll: true,
    columnLines: true,
    hideHeaders: false,

    store: 'allocationschemaweekday',

    viewConfig: {
        loadMask: false,
        loadingText: undefined,
        scroll:false,
        style:{
            overflow: 'auto',
            overflowX: 'hidden'
        }
    },

    listeners: {
        celldblclick: 'onCellDblClickWeekDay'
    },

    initComponent: function () {
        var me = this;
        me.buildField();
        me.callParent();
    },

    buildField: function () {
        var me = this;

        Ext.create('AppAnest.store.allocationschema.AllocationSchemaWeekDay');

        me.columns = [];
    },

    buttonAlign: 'center',

    buttons: [
        {
            glyph: 0xe86c,
            scale: 'medium',
            text: 'Salvar Mapa',
            showSmartTheme: 'red-dark',
            handler: 'onUpdateSchemaWeekDay'
        }, {
            glyph: 0xec9d,
            scale: 'medium',
            text: 'Limpar',
            showSmartTheme: 'sky',
            handler: 'onDeleteWeekDay'
        }, {
            glyph: 0xe869,
            scale: 'medium',
            text: 'Voltar',
            showSmartTheme: 'green',
            handler: 'onHistoryBack'
        }
    ]

});