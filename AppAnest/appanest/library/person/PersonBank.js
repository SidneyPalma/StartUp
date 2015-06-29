//@charset ISO-8859-1
Ext.define( 'AppAnest.person.PersonBank', {
    extend: 'Ext.panel.Panel',

    xtype: 'personbank',

    requires: [
        'Smart.form.field.ComboEnum',
        'AppAnest.model.person.PersonBank',
        'AppAnest.store.person.PersonBank'
    ],

    glyph: 0xee03,

    disabled: true,

    reference: 'bank',

    title: 'Bancos',

    layout: 'border',

    items: [
        {
            region: 'north',
            xtype: 'panel',
            bodyStyle: 'padding-top: 10px',
            items: [
                {
                    xtype: 'label',
                    text: 'Bancos listados',
                    style: {
                        color: 'blue;',
                        fontSize: '14px;'
                    }
                }
            ]
        }, {
            overflowY: 'auto',
            region: 'west',
            xtype: 'form',
            layout: 'anchor',
            width: 200,
            reference: 'bankForm',
            bodyStyle: 'padding: 10px 40px 10px 0',
            defaultType: 'textfield',
            items: [
                {
                    name: 'id',
                    xtype: 'hiddenfield'
                }, {
                    name: 'personid',
                    xtype: 'hiddenfield'
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Tipo de conta',
                    name: 'accounttypedescription'
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Banco',
                    name: 'bankdescription'
                }, {
                    anchor: '100%',
                    fieldLabel: 'Agência',
                    name: 'agency'
                }, {
                    anchor: '100%',
                    fieldLabel: 'Conta',
                    name: 'accountnumber'
                }, {
                    name: 'isdefault',
                    xtype: 'checkboxfield',
                    boxLabel: 'Conta principal'
                }, {
                    anchor: '100%',
                    xtype: 'container',
                    layout: 'hbox',
                    defaultType: 'button',
                    items: [
                        {
                            flex: 1,
                            glyph: 0xe86c,
                            text: 'Salvar',
                            showSmartTheme: 'red',
                            handler: 'updateBank'
                        }, {
                            xtype: 'splitter'
                        }, {
                            flex: 1,
                            glyph: 0xe875,
                            text: 'Novo',
                            showSmartTheme: 'red',
                            handler: 'insertBank'
                        }
                    ]
                }
            ]
        }, {
            region: 'center',
            hideHeaders: false,
            xtype: 'gridpanel',
            name: 'bank',
            store: Ext.create('AppAnest.store.person.PersonBank'),
            columns: [
                {
                    flex: 1,
                    text: 'Bancos',
                    renderer: function (value,metaData,record) {
                        var agency = record.get('agency'),
                            accountnumber = record.get('accountnumber'),
                            bankdescription = record.get('bankdescription'),
                            accounttypedescription = record.get('accounttypedescription');

                        return  '<a class="smart-medium-users-detail">Agência: '+ agency + ' - Conta: ' + accountnumber +'</a><br/>'+
                                '<a class="smart-medium-users-detail">' + accounttypedescription +' - ' + bankdescription +'</a>';
                    }
                }, {
                    width: 70,
                    text: 'Principal',
                    align: 'center',
                    renderer: function (value, meta, rec) {
                        return rec.get('isdefault') ? '<span style="color: #6E7B8B; width: 20px; font-size: 28px;"><i class="icon-ok-circled"></i></span>' : '';
                    }
                }
            ]
        }
    ]

});