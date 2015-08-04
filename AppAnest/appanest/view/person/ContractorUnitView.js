//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.ContractorUnitView', {
    extend: 'Ext.container.Container',

    xtype: 'contractorunitview',

    requires: [
        'Ext.tab.*',
        'Smart.form.field.ComboEnum',
        'Smart.address.TextAddress',
        'Smart.address.SearchAddress',
        'AppAnest.person.PersonPhone',
        'AppAnest.person.PersonAddress',
        'AppAnest.view.person.ContractorSearch',
        'AppAnest.view.person.NaturalPersonSearch'
    ],

    controller: 'contractorunit',

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

        Ext.create('AppAnest.store.person.ContractorSubUnit');
        Ext.create('AppAnest.store.person.ContractorUnitSchema');

        me.items = [
            {
                frame: true,
                xtype: 'panel',

                bodyStyle: 'padding: 30px 10px 10px 10px;',

                iconCls: 'icon-hospital',

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                header: {
                    title: 'Cadastro da Unidade do Contratante',
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
                                                        tableName: 'person'
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
                                                        xtype: 'hiddenfield',
                                                        name: 'typeperson',
                                                        value: 'U'
                                                    }, {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        defaultType: 'textfield',
                                                        items: [
                                                            {
                                                                flex: 5,
                                                                fieldLabel: 'Nome fantasia',
                                                                name: 'shortname'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 2,
                                                                maskRe: /[0-9\/]/,
                                                                fieldLabel: 'CNES',
                                                                name: 'cnesnumber'
                                                            }
                                                        ]
                                                    }, {
                                                        fieldLabel: 'Razão social',
                                                        name: 'name'
                                                    }, {
                                                        xtype: 'contractorsearch',
                                                        fieldLabel: 'Mantenedor',
                                                        name: 'parentname',
                                                        hiddenNameId: 'parentid'
                                                    }, {
                                                        vtype: 'email',
                                                        name: 'mainmail',
                                                        fieldLabel: 'E-mail principal'
                                                    //}, {
                                                    //    name: 'maincontact',
                                                    //    fieldLabel: 'Contato principal'
                                                    }, {
                                                        name: 'isactive',
                                                        xtype: 'checkboxfield',
                                                        boxLabel: 'Ativo'
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
                                                overflowY: 'auto',
                                                glyph: 0xe9eb,
                                                title: 'Complemento',
                                                layout: 'anchor',
                                                bodyStyle: 'padding-top: 10px',
                                                items: [
                                                    {
                                                        xtype: 'label',
                                                        text: 'Inscrições',
                                                        style: {
                                                            color: 'blue;',
                                                            fontSize: '14px;'
                                                        }
                                                    }, {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        margin: '0 0 10 0',
                                                        defaultType: 'textfield',
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                fieldLabel: 'CNPJ',
                                                                plugins: 'textmask',
                                                                money: false,
                                                                name: 'cnpjnumber',
                                                                mask: '99.999.999/9999-99'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                fieldLabel: 'Municipal',
                                                                name: 'countyregistration'
                                                            }, {
                                                                flex: 2,
                                                                xtype: 'container'
                                                            }
                                                        ]
                                                    }, {
                                                        xtype: 'fieldcontainer',
                                                        layout: 'hbox',
                                                        fieldLabel: 'Posicionamento',
                                                        defaultType: 'numberfield',
                                                        defaults: {
                                                            minValue: 0,
                                                            allowBlank: false,
                                                            hideTrigger: true
                                                        },
                                                        labelStyle: 'color: blue; font-size: 14px;',
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                name: 'position',
                                                                fieldLabel: 'Escala'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                name: 'positionmon',
                                                                fieldLabel: 'Segunda'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                name: 'positiontue',
                                                                fieldLabel: 'Terça'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                name: 'positionwed',
                                                                fieldLabel: 'Quarta'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                name: 'positionthu',
                                                                fieldLabel: 'Quinta'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                name: 'positionfri',
                                                                fieldLabel: 'Sexta'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {
                                                xtype: 'personaddress'
                                            }, {
                                                xtype: 'personphone'
                                            }, {
                                                glyph: 0xec2b,
                                                title: 'SubUnidades',

                                                disabled: true,

                                                reference: 'subunit',

                                                layout: 'border',

                                                items: [
                                                    {
                                                        region: 'north',
                                                        xtype: 'panel',
                                                        bodyStyle: 'padding-top: 10px',
                                                        items: [
                                                            {
                                                                xtype: 'label',
                                                                text: 'Sub unidades de atendimento',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        region: 'center',
                                                        xtype: 'gridpanel',
                                                        name: 'subunit',
                                                        reference: 'gridsubunit',
                                                        store: 'contractorsubunit',
                                                        columns: [
                                                            {
                                                                width: 25,
                                                                xtype: 'checkcolumn',
                                                                dataIndex: 'isactive'
                                                            }, {
                                                                flex: 1,
                                                                text: 'SubUnidades',
                                                                dataIndex: 'subunitdescription',
                                                                renderer: function (value, meta, rec) {
                                                                    var reserved = rec.get('reserved') ? '<span style="color: #FF6E48;"><i class="icon-lock"></i></span>' : '';
                                                                    return value + reserved;
                                                                }
                                                            }
                                                        ],
                                                        dockedItems: [
                                                            {
                                                                xtype: 'pagingtoolbar',
                                                                store: 'contractorsubunit',
                                                                dock: 'bottom',
                                                                displayInfo: true
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }, {
                                                glyph: 0xe953,
                                                title: 'Plantões',

                                                //disabled: true,

                                                reference: 'shifts',

                                                layout: 'border',

                                                items: [
                                                    {
                                                        region: 'north',
                                                        xtype: 'form',
                                                        style: {
                                                            borderBottom: 'solid 1px #cecece'
                                                        },
                                                        bodyStyle: 'padding-top: 10px',
                                                        items: [
                                                            {
                                                                xtype: 'label',
                                                                text: 'Esquema de processamento',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }, {
                                                                margin: '10 0 10 0',
                                                                xtype: 'container',
                                                                layout: 'hbox',
                                                                defaults: {
                                                                    allowBlank: false
                                                                },
                                                                items: [
                                                                    {
                                                                        width: 80,
                                                                        fieldLabel: 'Turno',
                                                                        xtype: 'comboenum',
                                                                        name: 'shiftdescription'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        width: 80,
                                                                        minValue: 1,
                                                                        maxValue: 10,
                                                                        fieldLabel: 'Posição',
                                                                        name: 'position',
                                                                        xtype: 'numberfield'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 2,
                                                                        fieldLabel: 'Dia',
                                                                        xtype: 'comboenum',
                                                                        name: 'weekdaydescription',
                                                                        filterField: {
                                                                            field: 'weekday',
                                                                            regex: /(^mon)|(^tue)|(^wed)|(^thu)|(^fri)/
                                                                        }
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 2,
                                                                        pageSize: 0,
                                                                        name: 'naturalpersonid',
                                                                        fieldLabel: 'Plantonista',
                                                                        xtype: 'naturalpersonsearch'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        margin: '10 0 0 0',
                                                                        scale: 'large',
                                                                        width: 110,
                                                                        xtype: 'button',
                                                                        glyph: 0xec48,
                                                                        text: 'Inserir',
                                                                        showSmartTheme: 'blue',
                                                                        handler: 'onUpdateShifts'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }, {
                                                        region: 'center',
                                                        xtype: 'gridpanel',
                                                        name: 'unitschema',
                                                        hideHeaders: false,
                                                        store: 'contractorunitschema',
                                                        columnsRenderer: function (value, metaData, record, rowIndex, colIndex) {
                                                            var me = this,
                                                                cell =  '<div>' +
                                                                            '<div style="float: left; width: 90%;">{0}</div>' +
                                                                            '<div style="float: left; width: 10%;" class="show-item">' +
                                                                                '<i class="icon-cancel-circled"></i>' +
                                                                            '</div>' +
                                                                        '</div>';

                                                            return ((value) && (value.length != 0)) ? Ext.String.format(cell,value) : value;
                                                        },
                                                        listeners: {
                                                            cellclick: 'onCellClick'
                                                        },
                                                        columns: [
                                                            {
                                                                width: 40,
                                                                text: '##',
                                                                align: 'center',
                                                                dataIndex: 'position',
                                                                renderer: function (value, metaData, record) {
                                                                    return Ext.String.leftPad(value, 2, '0');
                                                                }
                                                            }, {
                                                                flex: 1,
                                                                text: 'Segunda',
                                                                dataIndex: 'monperson'
                                                            }, {
                                                                flex: 1,
                                                                text: 'Terça',
                                                                dataIndex: 'tueperson'
                                                            }, {
                                                                flex: 1,
                                                                text: 'Quarta',
                                                                dataIndex: 'wedperson'
                                                            }, {
                                                                flex: 1,
                                                                text: 'Quinta',
                                                                dataIndex: 'thuperson'
                                                            }, {
                                                                flex: 1,
                                                                text: 'Sexta',
                                                                dataIndex: 'friperson'
                                                            }
                                                        ],
                                                        dockedItems: [
                                                            {
                                                                xtype: 'pagingtoolbar',
                                                                store: 'contractorunitschema',
                                                                dock: 'bottom',
                                                                displayInfo: true
                                                            }
                                                        ]
                                                    }
                                                ]
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