//@charset ISO-8859-1
Ext.define( 'AppAnest.view.person.NaturalPersonView', {
    extend: 'Ext.container.Container',

    xtype: 'naturalpersonview',

    requires: [
        'Ext.tab.*',
        'Smart.address.*',
        'AppAnest.person.*',
        'Smart.form.field.*',
        'AppAnest.view.person.*',
        'Ext.grid.plugin.RowEditing'
    ],

    controller: 'naturalperson',

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

                bodyStyle: 'padding: 30px 10px 10px 10px;',

                iconCls: 'icon-user-md',

                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },

                header: {
                    title: 'Cadastro do profissional',
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
                                                        value: 'N'
                                                    }, {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        defaultType: 'textfield',
                                                        items: [
                                                            {
                                                                flex: 5,
                                                                fieldLabel: 'Apelido',
                                                                name: 'shortname'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 2,
                                                                submitValue: false,
                                                                readOnlyColor: true,
                                                                fieldLabel: 'Matricula',
                                                                name: 'registrationcode'
                                                            }
                                                        ]
                                                    }, {
                                                        fieldLabel: 'Nome completo',
                                                        name: 'name'
                                                    }, {
                                                        vtype: 'email',
                                                        name: 'mainmail',
                                                        fieldLabel: 'E-mail principal'
                                                    }, {
                                                        xtype: 'container',
                                                        layout: 'hbox',
                                                        items: [
                                                            {
                                                                flex: 1,
                                                                name: 'birthdate',
                                                                xtype: 'datefield',
                                                                plugins: 'textmask',
                                                                fieldLabel: 'Nascimento'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                xtype: 'comboenum',
                                                                fieldLabel: 'Sexo',
                                                                name: 'genderdescription'
                                                            }, {
                                                                xtype: 'splitter'
                                                            }, {
                                                                flex: 1,
                                                                xtype: 'comboenum',
                                                                fieldLabel: 'Raça/Cor',
                                                                name: 'racecolordescription'
                                                            }
                                                        ]
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
                                        name: 'navigation',
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
                                                xtype: 'tabpanel',
                                                name: 'navigation-items',
                                                deferredRender: false,
//                                                ui: 'navigation-items',
                                                tabBar: {
                                                    layout: {
                                                        pack: 'center'
                                                    }
                                                },
                                                items: [
                                                    {
                                                        overflowY: 'auto',
                                                        glyph: 0xed0e,
                                                        title: 'Cadastro',
                                                        layout: 'anchor',
                                                        bodyStyle: 'padding-top: 10px',
                                                        items: [
                                                            {
                                                                xtype: 'label',
                                                                text: 'Cadastro',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }, {
                                                                xtype: 'container',
                                                                margin: '0 0 10 0',
                                                                layout: 'hbox',
                                                                defaultType: 'textfield',
                                                                items: [
                                                                    {
                                                                        flex: 1,
                                                                        maskRe: /[0-9\/]/,
                                                                        fieldLabel: 'Matricula',
                                                                        name: 'registrationid',
                                                                        listeners: {
                                                                            change: 'onChangeRegistrationId'
                                                                        }
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Ingressou em',
                                                                        xtype: 'datefield',
                                                                        plugins: 'textmask',
                                                                        name: 'associationdate'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Nacionalidade',
                                                                        name: 'nationality'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Local nascimento',
                                                                        name: 'placebirth'
                                                                    }
                                                                ]
                                                            }, {
                                                                xtype: 'label',
                                                                text: 'Filiação',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }, {
                                                                xtype: 'container',
                                                                margin: '0 0 10 0',
                                                                layout: 'hbox',
                                                                defaultType: 'textfield',
                                                                items: [
                                                                    {
                                                                        flex: 1,
                                                                        fieldLabel: 'Pai',
                                                                        name: 'namefather'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Mãe',
                                                                        name: 'namemother'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }, {
                                                        overflowY: 'auto',
                                                        glyph: 0xe873,
                                                        title: 'Documentação',
                                                        layout: 'anchor',
                                                        bodyStyle: 'padding-top: 10px',
                                                        items: [
                                                            {
                                                                xtype: 'label',
                                                                text: 'Conselho da categoria',
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
                                                                        maskRe: /[0-9\/]/,
                                                                        fieldLabel: 'CRM',
                                                                        name: 'crmnumber'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'UF emissor',
                                                                        name: 'crmissuingstate',
                                                                        plugins: 'textmask',
                                                                        money: false,
                                                                        mask: 'LL'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        maskRe: /[0-9\/]/,
                                                                        fieldLabel: 'CNES',
                                                                        name: 'cnesnumber'
                                                                    }
                                                                ]
                                                            }, {
                                                                xtype: 'label',
                                                                text: 'Pessoa fisica',
                                                                style: {
                                                                    color: 'blue;',
                                                                    fontSize: '14px;'
                                                                }
                                                            }, {
                                                                xtype: 'container',
                                                                layout: 'hbox',
                                                                defaultType: 'textfield',
                                                                items: [
                                                                    {
                                                                        flex: 1,
                                                                        maskRe: /[0-9\/]/,
                                                                        fieldLabel: 'Registro geral',
                                                                        name: 'identnumber'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Org. emissor',
                                                                        name: 'identissuing'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'UF emissor',
                                                                        name: 'identissuingstate',
                                                                        plugins: 'textmask',
                                                                        money: false,
                                                                        mask: 'LL'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        xtype: 'datefield',
                                                                        plugins: 'textmask',
                                                                        fieldLabel: 'Data emissão',
                                                                        name: 'identissuingdate'
                                                                    }
                                                                ]
                                                            }, {
                                                                xtype: 'container',
                                                                layout: 'hbox',
                                                                margin: '0 0 10 0',
                                                                defaultType: 'textfield',
                                                                items: [
                                                                    {
                                                                        flex: 1,
                                                                        fieldLabel: 'CPF',
                                                                        plugins: 'textmask',
                                                                        money: false,
                                                                        vtype: 'cpf',
                                                                        name: 'cpfnumber',
                                                                        mask: '999.999.999-99'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'PIS/PASEP/NIT',
                                                                        name: 'pispasep'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'ISS(Inscr. Munic.)',
                                                                        name: 'countyregistration'
                                                                    }
                                                                ]
                                                            }, {
                                                                xtype: 'label',
                                                                text: 'Titulo de eleitor',
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
                                                                        fieldLabel: 'Inscrição',
                                                                        name: 'voter'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Zona',
                                                                        name: 'voterzone'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        fieldLabel: 'Seção',
                                                                        name: 'votersection'
                                                                    }, {
                                                                        xtype: 'splitter'
                                                                    }, {
                                                                        flex: 1,
                                                                        xtype: 'datefield',
                                                                        plugins: 'textmask',
                                                                        fieldLabel: 'Data emissão',
                                                                        name: 'voterissuingdate'
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }, {
                                                        xtype: 'personaddress'
                                                    }, {
                                                        xtype: 'personphone'
                                                    }, {
                                                        xtype: 'personbank'
                                                    }
                                                ]
                                            }, {
                                                title: 'Distribuição',
                                                glyph: 0xebb3,
                                                xtype: 'gridpanel',
                                                name: 'distribution',
                                                hideHeaders: false,
                                                cls: 'distribution-edit',
                                                store: Ext.create('AppAnest.store.person.NaturalPersonDistribution'),
                                                columnsRenderer: function (value,metaData,record) {
                                                    metaData.style = ( record.get('shift') == "P" ) ? "text-align: center;" : "";
                                                    return value;
                                                },
                                                columns: [
                                                    {
                                                        text: '<b style="color: #0016b0">Turnos</b>',
                                                        dataIndex: 'shiftdescription',
                                                        flex: 1,
                                                        renderer: function (value,metaData,record) {
                                                            metaData.style = "background: rgba(245, 245, 245, 1);";
                                                            return value;
                                                        }
                                                    }, {
                                                        text: '<b style="color: #0016b0">DIAS DA SEMANA</b>',
                                                        columns: [
                                                            {
                                                                text: 'Segunda',
                                                                dataIndex: 'mondescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'mon',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }, {
                                                                text: 'Terça',
                                                                dataIndex: 'tuedescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'tue',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }, {
                                                                text: 'Quarta',
                                                                dataIndex: 'weddescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'wed',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }, {
                                                                text: 'Quinta',
                                                                dataIndex: 'thudescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'thu',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }, {
                                                                text: 'Sexta',
                                                                dataIndex: 'fridescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'fri',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }
                                                        ]
                                                    }, {
                                                        text: '<b style="color: #0016b0">FINAL DE SEMANA</b>',
                                                        columns: [
                                                            {
                                                                text: '<b>Sábado</b>',
                                                                dataIndex: 'satdescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'sat',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }, {
                                                                text: '<b>Domingo</b>',
                                                                dataIndex: 'sundescription',
                                                                width: 76,
                                                                editor: {
                                                                    updateField: 'sun',
                                                                    xtype: 'contractorunitsearch'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ],
                                                selModel: 'rowmodel',
                                                plugins: {
                                                    ptype: 'rowediting',
                                                    clicksToEdit: 2
                                                },
                                                listeners: {
                                                    edit: 'onDistributionEdit',
                                                    beforeedit: 'onDistributionBeforeEdit',
                                                    celldblclick: 'onDistributionCellDblClick'
                                                }
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