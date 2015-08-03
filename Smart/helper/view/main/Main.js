//@charset ISO-8859-1
Ext.define( 'Smart.view.main.Main', {
    extend: 'Ext.container.Container',

    xtype: 'main',

    requires: [
        'Smart.store.Entity',
        'Smart.store.Fields',
        'Smart.view.main.MainComment',
        'Ext.grid.plugin.CellEditing'
    ],

    margin: '20 0 0 0',
    controller: 'main',

    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;
        me.buildItems();
        me.callParent();
    },

    buildItems: function () {
        var me = this,
            entityStore = Ext.create('Smart.store.Entity'),
            fieldsStore = Ext.create('Smart.store.Fields');

        me.items = [
            {
                width: 400,
                region: 'west',
                xtype: 'container'
            }, {
                region: 'center',
                frame: true,
                xtype: 'form',
                title: 'Smart - Class builder',
                items: [
                    {
                        padding: 10,
                        xtype: 'panel',
                        layout: 'anchor',
                        defaultType: 'fieldcontainer',
                        defaults: {
                            defaultType: 'textfield',
                            layout: 'hbox',
                            anchor: '100%',
                            defaults: {
                                allowBlank: false
                            }
                        },
                        items: [
                            {
                                fieldLabel: 'Parametros da Entidade',
                                items: [
                                    {
                                        flex: 1,
                                        xtype: 'container',
                                        layout: 'hbox',
                                        defaultType: 'textfield',
                                        defaults: {
                                            allowBlank: false
                                        },
                                        items: [
                                            {
                                                flex: 1,
                                                name: 'namespace',
                                                fieldLabel: 'Namespace'
                                            }, {
                                                xtype: 'splitter'
                                            }, {
                                                flex: 2,
                                                name: 'package',
                                                fieldLabel: 'Pacote ExtJS (store e model)'
                                            }
                                        ]
                                    }, {
                                        xtype: 'splitter'
                                    }, {
                                        xtype: 'combobox',
                                        store: entityStore,
                                        name: 'model',
                                        flex: 1,
                                        displayField: 'TABLE_NAME',
                                        valueField: 'TABLE_NAME',
                                        fieldLabel: 'Model (nome da tabela no banco)',
                                        listeners: {
                                            change: function ( field, newValue ) {
                                                var form = field.up('form');
                                                form.down('textfield[name=cache]').setValue('Cache\\'+'\\'+newValue);
                                                form.down('textfield[name=event]').setValue('Event\\'+'\\'+newValue);
                                            }
                                        }
                                    }
                                ]
                            }, {
                                items: [
                                    {
                                        name: 'cache',
                                        flex: 1,
                                        emptyText: 'Cache\\' + '\\',
                                        fieldLabel: 'Cache ( repositórios de DML´s customizados )'
                                    }, {
                                        xtype: 'splitter'
                                    }, {
                                        name: 'event',
                                        flex: 1,
                                        emptyText: 'Event\\' + '\\',
                                        allowBlank: true,
                                        fieldLabel: 'Event (eventos do model, opcional)'
                                    }
                                ]
                            }, {
                                defaultType: 'checkboxfield',
                                items: [
                                    {
                                        fieldLabel: 'ExtJS DataPackage',
                                        boxLabel  : 'Gerar Model',
                                        name      : 'createmodel',
                                        checked   : true
                                    }
                                ]
                            }, {
                                frame: true,
                                rowLines: false,
                                hideHeaders: false,
                                xtype: 'gridpanel',
                                title: 'Campos da Entidade',
                                tools: [
                                    {
                                        type: 'search',
                                        callback: function(grid) {
                                            var form = grid.up('form'),
                                                classname = form.down('textfield[name=model]');
                                            if(form.isValid()) {
                                                //grid.store.setParams({
                                                //    query: classname.getValue(),
                                                //    action: 'selectFields'
                                                //}).load();

                                                form.setLoading('Carregando ...');

                                                grid.store.setParams({
                                                    query: classname.getValue(),
                                                    action: 'selectFields'
                                                }).load({
                                                    callback: function() {
                                                        form.setLoading(false);
                                                    }
                                                });

                                            }
                                        }
                                    }
                                ],
                                store: fieldsStore,
                                columns: [
                                    {
                                        align: 'center',
                                        header: 'CODE',
                                        dataIndex: 'ORDINAL_POSITION',
                                        width: 60,
                                        renderer: function (value, metaData, record) {
                                            metaData.style = "background: #F5F9E8";
                                            return value;
                                        }
                                    }, {
                                        header: 'NAME',
                                        dataIndex: 'COLUMN_NAME',
                                        flex: 1
                                    }, {
                                        header: 'TYPE',
                                        dataIndex: 'DATA_TYPE',
                                        width: 80
                                    }, {
                                        header: 'LENGTH',
                                        dataIndex: 'CHARACTER_MAXIMUM_LENGTH',
                                        width: 100
                                    }, {
                                        header: 'DEFAULT',
                                        dataIndex: 'COLUMN_DEFAULT',
                                        width: 100,
                                        renderer: function (value, metaData, record) {
                                            metaData.style = "background: #F5F9E8";
                                            return value;
                                        }
                                    }, {
                                        header: 'NULLABLE',
                                        dataIndex: 'IS_NULLABLE',
                                        width: 90
                                    }, {
                                        header: '<div style="color: red">POLICY</div>',
                                        dataIndex: 'HAS_POLICY',
                                        xtype: 'checkcolumn',
                                        width: 70,
                                        stopSelection: false
                                    }, {
                                        header: '<div style="color: red">IGNORE</div>',
                                        dataIndex: 'HAS_IGNORE',
                                        xtype: 'checkcolumn',
                                        width: 70,
                                        stopSelection: false
                                    }, {
                                        header: '<div class="x-tool-img x-tool-help"></div>',
                                        width: 36,
                                        align: 'center',
                                        renderer: function (value, meta, rec) {
                                            return '<span style="color: #D9D6C5; cursor: pointer;font-size: 16px;"><i class="icon-comment"></i></span>';
                                        }
                                    }
                                ],
                                selModel: {
                                    selType: 'cellmodel'
                                },
                                plugins: {
                                    ptype: 'cellediting',
                                    clicksToEdit: 1
                                },
                                listeners: {
                                    celldblclick: function ( viewTable, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
                                        var comment = Ext.widget('maincomment',{ xdata: record });

                                        if(cellIndex === 8) {
                                            comment.show(null,function () {
                                                comment.down('form').loadRecord(record);
                                            },me);
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'Confirmar',
                        handler: 'doConfirm'
                    }
                ]
            }, {
                width: 400,
                region: 'east',
                xtype: 'container'
            }
        ];
    }

});