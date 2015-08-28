//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleReport', {
    extend: 'Ext.window.Window',

    xtype: 'allocationschedulereport',

    requires: [
        'Smart.form.field.ComboSearch',
        'AppAnest.view.period.PeriodSearch',
        'AppAnest.view.allocationschedule.AllocationWeek'
    ],

    controller: 'allocationschedule',

    width: 400,

    title: 'Imprimir Folha de Frequencia',

    modal: true,

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
                    anchor: '100%',
                    allowBlank: false
                },
                items: [
                    {
                        fieldLabel: 'Competencia',
                        name: 'periodid',
                        xtype: 'periodsearch',
                        listeners: {
                            select: 'onSelectPeriodReport'
                        }
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel: 'Intervalo',
                        layout: 'hbox',
                        defaultType: 'datefield',
                        defaults: {
                            allowBlank: false
                        },
                        items: [
                            {
                                flex: 1,
                                plugins: 'textmask',
                                fieldLabel: 'De',
                                name: 'dateof'
                            }, {
                                xtype: 'splitter'
                            }, {
                                flex: 1,
                                plugins: 'textmask',
                                fieldLabel: 'Ate',
                                name: 'dateto'
                            }
                        ]
                    }, {
                        submitValue: false,
                        hiddenNameId: 'contractorunitid',
                        fieldLabel: 'Unidade',
                        xtype: 'combosearch',
                        store: 'AppAnest.store.person.ContractorUnit',
                        valueField: 'id',
                        displayField: 'shortname'
                    }, {
                        fieldLabel: 'SubUnidade',
                        submitValue: false,
                        hiddenNameId: 'subunit',
                        xtype: 'combosearch',
                        store: 'AppAnest.store.person.ContractorSubUnit',
                        valueField: 'subunitdescription',
                        displayField: 'subunitdescription'
                    }
                ]
            }
        ]
    },

    buttons: [
        {
            text: 'Imprimir',
            handler: 'showReportSheetFrequency'
        }, {
            text: 'Fechar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ]

});