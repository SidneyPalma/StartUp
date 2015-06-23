//@charset ISO-8859-1
Ext.define( 'AppAnest.view.contract.ContractView', {
    extend: 'Ext.container.Container',

    xtype: 'contractview',

    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Smart.form.field.*',
        'Smart.util.Resource',
        'Smart.plugins.TreeFilter',
        'Ext.grid.plugin.RowEditing'
    ],

    controller: 'contract',

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

                bodyStyle: '0 10px 10px 10px;',

                iconCls: 'icon-hospital',

                layout: 'border',

                header: {
                    title: 'Contratos/Aditivos',
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
                        height: 30,
                        region: 'north',
                        xtype: 'panel',
                        name: 'buttonstatus',
                        listeners: {
                            afterrender: 'showButtonStatus'
                        }
                    }, {
                        region: 'center',
                        xtype: 'panel',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                flex: 1,
                                xtype: 'container',
                                cls: 'smart-theme wallpaper'
                            }, {
                                width: 600,
                                xtype: 'form',
                                layout: 'border',
                                items: [
                                    {
                                        height: 70,
                                        region: 'north',
                                        xtype: 'panel',
                                        layout: 'anchor',
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                flex: 1,
                                                xtype: 'container',
                                                layout: 'hbox',
                                                defaultType: 'textfield',
                                                defaults: {
                                                    useMondaFont: true,
                                                    readOnlyColor: true
                                                },
                                                items: [
                                                    {
                                                        reference: 'id',
                                                        xtype: 'hiddenfield',
                                                        name: 'id'
                                                    }, {
                                                        xtype: 'hiddenfield',
                                                        name: 'contractid'
                                                    }, {
                                                        flex: 1,
                                                        fieldLabel: 'Contrato n.o',
                                                        name: 'contractnumber',
                                                        plugins: 'textmask',
                                                        mask: '999/9999',
                                                        fieldStyle: {
                                                            color: '#C02942;',
                                                            fontSize: '16px;'
                                                        }
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        flex: 1,
                                                        fieldLabel: 'Contrato data',
                                                        name: 'contractdate',
                                                        xtype: 'datefield',
                                                        plugins: 'textmask',
                                                        fieldStyle: {
                                                            color: '#C02942;',
                                                            fontSize: '16px;'
                                                        }
                                                    }, {
                                                        xtype: 'splitter'
                                                    }, {
                                                        flex: 1,
                                                        name: 'additivenumber',
                                                        fieldLabel: 'Aditivo n.o',
                                                        plugins: 'textmask',
                                                        mask: '999',
                                                        fieldStyle: {
                                                            color: '#C02942;',
                                                            fontSize: '16px;'
                                                        }
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
                                        listeners: {
                                            tabchange: 'onSubUnitTabChange'
                                        },
                                        items: [
                                            {
                                                glyph: 0xe9eb,
                                                index: 0,
                                                title: 'Complemento',
                                                overflowY: 'auto',
                                                layout: 'anchor',
                                                bodyStyle: 'padding-top: 10px',
                                                defaults: {
                                                    anchor: '100%'
                                                },
                                                items: [
                                                    {
                                                        fieldLabel: 'Celebrado entre as partes',
                                                        labelStyle: 'color: blue; font-size: 14px;',
                                                        xtype: 'fieldcontainer',
                                                        layout: 'hbox',
                                                        defaultType: 'textfield',
                                                        defaults: {
                                                            readOnlyColor: true
                                                        },
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                name: 'legalentity',
                                                                fieldLabel: 'Empresa Contratada'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                width: 194,
                                                                name: 'contractor',
                                                                fieldLabel: 'Mantenedora'
                                                            }
                                                        ]
                                                    }, {
                                                        fieldLabel: 'Vigência',
                                                        labelStyle: 'color: blue; font-size: 14px;',
                                                        xtype: 'fieldcontainer',
                                                        layout: 'hbox',
                                                        defaults: {
                                                            readOnlyColor: true
                                                        },
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                fieldLabel: 'De',
                                                                xtype: 'datefield',
                                                                plugins: 'textmask',
                                                                name: 'periodof'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                fieldLabel: 'Até',
                                                                xtype: 'datefield',
                                                                plugins: 'textmask',
                                                                name: 'periodto'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                xtype: 'datefield',
                                                                plugins: 'textmask',
                                                                fieldLabel: 'Assinou em',
                                                                name: 'datesign'
                                                            }
                                                        ]
                                                    }, {
                                                        readOnlyColor: true,
                                                        fieldLabel: 'Descrição',
                                                        xtype: 'textfield',
                                                        name: 'description'
                                                    }, {
                                                        height: 250,
                                                        fieldLabel: 'Nota',
                                                        name: 'note',
                                                        xtype: 'displayfield',
                                                        useMondaFont: true,
                                                        fieldStyle: {
                                                            color: '#C02942;',
                                                            fontSize: '16px;'
                                                        }
                                                    }
                                                ]
                                            }, {
                                                index: 1,
                                                glyph: 0xe9ee,
                                                xtype: 'panel',
                                                title: 'Tabela',
                                                overflowY: 'auto',
                                                layout: 'border',
                                                items: [
                                                    {
                                                        region: 'north',
                                                        height: 36,
                                                        bodyStyle: 'padding-top: 14px',
                                                        items: [
                                                            {
                                                                xtype: 'label',
                                                                text: 'Valor plantões',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        region: 'center',
                                                        xtype: 'gridpanel',
                                                        store: Ext.create('AppAnest.store.contract.AdditiveTable'),
                                                        hideHeaders: false,
                                                        reference: 'additivetable',
                                                        cls: 'additivetable-edit',
                                                        columns: [
                                                            {
                                                                flex: 1,
                                                                text: 'Tipo de plantão',
                                                                dataIndex: 'shifttypedescription',
                                                                renderer: function (value, metaData, record) {
                                                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda; background: #e6e6e6;';
                                                                    return '<div class="shift-label">'+value+'</div>';
                                                                }
                                                            }, {
                                                                width: 100,
                                                                align: 'right',
                                                                text: 'Quantidade',
                                                                dataIndex: 'shiftamount',
                                                                editor: {
                                                                    xtype: 'textfield',
                                                                    plugins: 'textmask',
                                                                    mask: '9.999.990,00',
                                                                    money: true,
                                                                    cls: 'additivetable-edit'
                                                                },
                                                                renderer: function (value, metaData, record) {
                                                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda;';
                                                                    return Smart.maskRenderer('9.999.990,00',true)(value);
                                                                }
                                                            }, {
                                                                width: 120,
                                                                align: 'right',
                                                                text: 'Valor Unitário',
                                                                dataIndex: 'shiftvalue',
                                                                editor: {
                                                                    xtype: 'textfield',
                                                                    plugins: 'textmask',
                                                                    mask: '9.999.990,00',
                                                                    money: true,
                                                                    cls: 'additivetable-edit'
                                                                },
                                                                renderer: function (value, metaData, record) {
                                                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda;';
                                                                    return Smart.maskRenderer('9.999.990,00',true)(value);
                                                                }
                                                            }, {
                                                                width: 140,
                                                                align: 'right',
                                                                text: 'Valor Total',
                                                                renderer: function (value, metaData, record) {
                                                                    var totalshiftvalue = parseFloat(record.get('shiftvalue')) * parseFloat(record.get('shiftamount'));
                                                                    metaData.style = 'padding-top: 12px; font-size: 14px; font-family: Monda; color: #C02942;';
                                                                    return Smart.maskRenderer('9.999.990,00',true)(totalshiftvalue);
                                                                }
                                                            }
                                                        ],
                                                        selModel: 'rowmodel',
                                                        plugins: {
                                                            ptype: 'rowediting',
                                                            clicksToEdit: 2
                                                        },
                                                        listeners: {
                                                            edit: 'onAdditiveTableEdit'
                                                        }
                                                    }, {
                                                        region: 'south',
                                                        height: 50,
                                                        xtype: 'panel',
                                                        layout: 'hbox',
                                                        defaultType: 'textfield',
                                                        defaults: {
                                                            useMondaFont: true,
                                                            readOnlyColor: true
                                                        },
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                xtype: 'container'
                                                            }, {
                                                                width: 100,
                                                                name: 'shiftamount',
                                                                xtype: 'textfield',
                                                                plugins: 'textmask',
                                                                mask: '9.999.990,00',
                                                                money: true,
                                                                fieldStyle: {
                                                                    color: '#C02942;',
                                                                    fontSize: '16px;'
                                                                }
                                                            }, {
                                                                width: 120,
                                                                xtype: 'container'
                                                            }, {
                                                                width: 140,
                                                                name: 'totalshiftvalue',
                                                                xtype: 'textfield',
                                                                plugins: 'textmask',
                                                                mask: '9.999.990,00',
                                                                money: true,
                                                                fieldStyle: {
                                                                    color: '#C02942;',
                                                                    fontSize: '16px;'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {
                                                overflowY: 'auto',
                                                glyph: 0xe900,
                                                index: 2,
                                                title: 'Unidades',
                                                xtype: 'form',
                                                layout: 'border',
                                                items: [
                                                    {
                                                        region: 'north',
                                                        xtype: 'panel',
                                                        layout: 'anchor',
                                                        bodyStyle: 'padding-top: 14px',
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'label',
                                                                text: 'Unidades e turnos do aditivo',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }, {
                                                                height: 30,
                                                                xtype: 'radiogroup',
                                                                vertical: true,
                                                                columns: 3,
                                                                items: [
                                                                    { boxLabel: 'Todas as unidades', name: 'showfilter', inputValue: '1', checked: true },
                                                                    { boxLabel: 'Unidades com lançamentos', name: 'showfilter', inputValue: '2' },
                                                                    { boxLabel: 'Unidades sem lançamentos', name: 'showfilter', inputValue: '3' }
                                                                ],
                                                                listeners: {
                                                                    change: 'onChangeShowFilter'
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        split: true,
                                                        region: 'west',
                                                        width: 190,
                                                        xtype: 'panel',
                                                        layout: 'border',
                                                        items: [
                                                            {
                                                                region: 'north',
                                                                height: 30,
                                                                layout: 'fit',
                                                                items: [
                                                                    {
                                                                        height: 30,
                                                                        xtype: 'textfield',
                                                                        cls: 'search-tree',
                                                                        emptyText: 'Filtrar unidades',
                                                                        listeners: {
                                                                            change: function (field, newValue, oldValue, eOpts) {
                                                                                var tree = field.up('contractview').down('treepanel');

                                                                                tree.getSelectionModel().select(0);
                                                                                tree.filter(newValue);
                                                                                Ext.getStore('additiveshift').removeAll();
                                                                                Ext.getStore('contractorsubunit').removeAll();
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }, {
                                                                region: 'center',
                                                                xtype: 'treepanel',
                                                                reference: 'additiveshift',
                                                                cls: 'appanest-tree',
                                                                useArrows: true,
                                                                singleExpand: true,
                                                                plugins: [
                                                                    {
                                                                        ptype: 'treefilter',
                                                                        allowParentFolders: true
                                                                    }
                                                                ],
                                                                columns: [
                                                                    {
                                                                        xtype: 'treecolumn',
                                                                        flex: 1,
                                                                        sortable: true,
                                                                        dataIndex: 'text',
                                                                        renderer: function (value, metaData, record) {
                                                                            var leaf = record.get('leaf'),
                                                                                released = parseFloat(record.get('released')),
                                                                                color = ((leaf) && (released == 0.00)) ? '' : 'style="color: blue;"',
                                                                                glyph = ((leaf) && (released == 0.00)) ? record.get('glyph') : ((leaf) ? 'icon-certificate-1' : record.get('glyph') ),
                                                                                recordValue = Ext.String.format('<i {0} class="{1} size-medium"></i><span style="font-family: Monda;">{2}</span>',color,glyph,value),
                                                                                releasedValue = '<div style="height: 70%; font-family: Monda;">' +
                                                                                    '<div style="float: left; padding-left: 44px; color: #0066cc;">Plantões</div>' +
                                                                                    '<div style="float: right; color: #0016b0;">' + Smart.MoneyMask.setMask('9.999.990,00').mask(released) +'</div>' +
                                                                                    '</div>';

                                                                            metaData.style = 'line-height: 20px;';

                                                                            return recordValue + ((leaf) ? ((released != 0.00) ? releasedValue : '') : releasedValue);
                                                                        }
                                                                    }
                                                                ],
                                                                listeners: {
                                                                    select: 'onUnitSelect'
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        region: 'center',
                                                        layout: 'border',
                                                        items: [
                                                            {
                                                                height: 117,
                                                                region: 'north',
                                                                xtype: 'gridpanel',
                                                                split: true,
                                                                rowLines: false,
                                                                hideHeaders: false,
                                                                reference: 'subunit',
                                                                cls: 'subunit-list',
                                                                store: Ext.create('AppAnest.store.person.ContractorSubUnit'),
                                                                columns: [
                                                                    {
                                                                        text: 'SubUnidades',
                                                                        dataIndex: 'subunitdescription',
                                                                        flex: 1,
                                                                        renderer: function (value, metaData, record) {
                                                                            metaData.style = 'font-size: 14px; font-family: Monda; line-height: 20px;';
                                                                            return value;
                                                                        }
                                                                    }, {
                                                                        width: 100,
                                                                        text: 'Quantidade',
                                                                        dataIndex: 'shiftstotal',
                                                                        align: 'right',
                                                                        renderer: function (value, metaData, record) {
                                                                            metaData.style = 'font-size: 14px; font-family: Monda; line-height: 20px;';
                                                                            return Smart.maskRenderer('9.999.990,00',true)(value);
                                                                        }
                                                                    }
                                                                ],
                                                                listeners: {
                                                                    select: 'onSubUnitSelect'
                                                                }
                                                            }, {
                                                                region: 'center',
                                                                xtype: 'gridpanel',
                                                                hideHeaders: false,
                                                                cls: 'additiveshift-edit',
                                                                reference: 'additiveShiftGrid',
                                                                store: Ext.create('AppAnest.store.contract.AdditiveShift'),
                                                                columnsRenderer: function (value, metaData, record) {
                                                                    metaData.style = 'padding-top: 14px; font-size: 16px; font-family: Monda;';
                                                                    return value;
                                                                },
                                                                columns: [
                                                                    {
                                                                        text: 'Turnos',
                                                                        width: 88,
                                                                        renderer: function (value, metaData, record) {
                                                                            var hours = record.get('hours'),
                                                                                validityof = record.get('validityof').substr(0,5),
                                                                                validityto = record.get('validityto').substr(0,5),
                                                                                shiftdescription = record.get('shiftdescription');

                                                                            metaData.style = 'font-size: 10px; font-family: Monda; background: #e6e6e6;';
                                                                            return  '<div class="shift-label"><b>'+ shiftdescription +'</b><br/>'+ validityof + ' - ' + validityto +'</div>' +
                                                                            Ext.String.format('<div style="width: 100%;" class="data"><span class="additive-status-l">{0}h</span></div>',hours);
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'SEG',
                                                                        align: 'right',
                                                                        dataIndex: 'amountmon',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'TER',
                                                                        align: 'right',
                                                                        dataIndex: 'amounttue',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'QUA',
                                                                        align: 'right',
                                                                        dataIndex: 'amountwed',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'QUI',
                                                                        align: 'right',
                                                                        dataIndex: 'amountthu',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'SEX',
                                                                        align: 'right',
                                                                        dataIndex: 'amountfri',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'SAB',
                                                                        align: 'right',
                                                                        dataIndex: 'amountsat',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }, {
                                                                        flex: 1,
                                                                        text: 'DOM',
                                                                        align: 'right',
                                                                        dataIndex: 'amountsun',
                                                                        editor: {
                                                                            minValue: 1,
                                                                            hideTrigger: true,
                                                                            xtype: 'numberfield',
                                                                            cls: 'additiveshift-edit'
                                                                        }
                                                                    }
                                                                ],
                                                                selModel: 'rowmodel',
                                                                plugins: {
                                                                    ptype: 'rowediting',
                                                                    clicksToEdit: 2
                                                                },
                                                                listeners: {
                                                                    edit: 'onSubUnitEdit'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {
                                                index: 3,
                                                glyph: 0xe9dd,
                                                xtype: 'panel',
                                                title: 'Arquivos',
                                                overflowY: 'auto',
                                                layout: 'border',
                                                items: [
                                                    {
                                                        region: 'north',
                                                        xtype: 'form',
                                                        name: 'contractdata',
                                                        bodyStyle: 'padding-top: 10px',
                                                        layout: 'anchor',
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'hiddenfield',
                                                                name: 'id'
                                                            }, {

                                                                xtype: 'hiddenfield',
                                                                name: 'contractid'
                                                            }, {
                                                                fieldLabel: 'Aquivos do Contrato / Aditivo',
                                                                labelStyle: 'color: blue; font-size: 14px;',
                                                                xtype: 'fieldcontainer',
                                                                layout: 'hbox',
                                                                items: [
                                                                    {
                                                                        flex: 1,
                                                                        fieldLabel: 'Arquivo',
                                                                        xtype: 'filefield',
                                                                        name: 'filedata',
                                                                        tableName: 'contractdata',
                                                                        accept: 'application/pdf',
                                                                        buttonText: Ext.emptyText,
                                                                        buttonConfig: {
                                                                            width: 34,
                                                                            minWidth: 34,
                                                                            glyph: 0xeef8,
                                                                            showSmartTheme: 'green'
                                                                        }
                                                                    }
                                                                ]
                                                            }, {
                                                                allowBlank: false,
                                                                maxLength: 8,
                                                                xtype: 'textfield',
                                                                fieldLabel: 'Nome abreviado (8 caracteres no máximo)',
                                                                name: 'description'
                                                            }, {
                                                                allowBlank: false,
                                                                fieldLabel: 'Observações',
                                                                xtype: 'textareafield',
                                                                name: 'observation'
                                                            }
                                                        ]
                                                    }, {
                                                        region: 'center',
                                                        xtype: 'panel',
                                                        glyph: 0xe889,
                                                        layout: 'fit',
                                                        title: 'Arquivos no contrato',
                                                        items: [
                                                            {
                                                                xtype: 'dataview',
                                                                cls: 'contractdata',
                                                                store: Ext.create('AppAnest.store.contract.ContractData'),
                                                                tpl: new Ext.XTemplate(
                                                                    '<tpl for=".">',
                                                                    '<div style="margin-bottom: 10px;" class="thumb-wrap">',
                                                                    '<img src="{filetype}"/><br/>',
                                                                    '<span>{contractcode}<br/><b style="color: brown;">{additivecode}</b></span>',
                                                                    '</div>',
                                                                    '</tpl>'
                                                                ),
                                                                trackOver: true,
                                                                autoScroll: true,
                                                                multiSelect: false,
                                                                overItemCls: 'x-item-over',
                                                                itemSelector: 'div.thumb-wrap',
                                                                prepareData: function (data) {
                                                                    if(data.fileinfo) {
                                                                        Ext.apply(data, {
                                                                            filetype: Smart.Resource.getIconFile(data.tablename)
                                                                        });
                                                                    }
                                                                    return data;
                                                                },
                                                                listeners: {
                                                                    itemdblclick: 'onItemDblClick',
                                                                    render: function (view, eOpts) {
                                                                        view.tip = Ext.create('Ext.tip.ToolTip', {
                                                                            target: view.el,
                                                                            delegate: view.itemSelector,
                                                                            trackMouse: true,
                                                                            minWidth: 300,
                                                                            maxWidth: 500,
                                                                            dismissDelay: 0,
                                                                            showDelay: 800,
                                                                            renderTo: Ext.getBody(),
                                                                            listeners: {
                                                                                beforeshow: function updateTipBody(tip) {
                                                                                    var data = view.getRecord(tip.triggerElement),
                                                                                        fileinfo = Ext.decode(data.get('fileinfo')),
                                                                                        fileName = fileinfo.fileName,
                                                                                        observation = data.get('observation'),
                                                                                        description = Ext.String.format('<div style="font-family: Monda;"><b>{0}</b><br/>Observações<br/>{1}</div>', fileName, observation);
                                                                                    tip.update(description);
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        glyph: 0xe86c,
                                        text: 'Salvar',
                                        disabled: true,
                                        name: 'updateView',
                                        showSmartTheme: 'red',
                                        handler: 'updateView'
                                    }, {
                                        glyph: 0xe869,
                                        text: 'Voltar',
                                        showSmartTheme: 'green',
                                        handler: 'onHistoryBack'
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
        ]
    }

});