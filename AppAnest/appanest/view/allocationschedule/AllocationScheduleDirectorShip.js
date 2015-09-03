//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.AllocationScheduleDirectorShip', {
    extend: 'Ext.window.Window',

    xtype: 'allocationscheduledirectorship',

    requires: [
        'Ext.selection.CheckboxModel',
        'Smart.form.field.ComboSearch',
        'AppAnest.view.period.PeriodSearch',
        'AppAnest.view.allocationschedule.AllocationWeek'
    ],

    controller: 'allocationschedule',

    width: 360,

    title: 'Imprimir Escala para Diretoria',

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

        Ext.create('AppAnest.store.person.ContractorUnit');

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
                        readOnlyColor: false,
                        useMondaFont: true,
                        fieldStyle: {
                            color: 'blue;',
                            fontSize: '16px;'
                        }
                    }, {
                        name: 'periodid',
                        xtype: 'hiddenfield'
                    }, {
                        height: 410,
                        rowLines: false,
                        xtype: 'gridpanel',
                        hideHeaders: false,
                        selModel: {
                            selType: 'checkboxmodel'
                        },
                        store: 'contractorunit',
                        columns: [
                            {
                                sortable: false,
                                text: '<span style="font-size: 16px;">Marcar todas as Unidades </span>',
                                dataIndex: 'shortname',
                                flex: 1
                            }
                        ]
                    }
                ]
            }
        ]
    },

    listeners: {
        show: 'onShowDirectorShip'
    },

    buttons: [
        {
            text: 'Imprimir',
            handler: 'showReportDirectorShip'
        }, {
            text: 'Fechar',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ]

});