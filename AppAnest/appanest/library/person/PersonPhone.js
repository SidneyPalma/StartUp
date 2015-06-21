//@charset ISO-8859-1
Ext.define( 'AppAnest.person.PersonPhone', {
    extend: 'Ext.panel.Panel',

    xtype: 'personphone',

    requires: [
        'Smart.form.field.ComboEnum',
        'AppAnest.model.person.PersonPhone',
        'AppAnest.store.person.PersonPhone'
    ],

    glyph: 0xe891,

    disabled: true,

    reference: 'phone',

    title: 'Telefones',

    layout: 'border',

    items: [
        {
            region: 'north',
            xtype: 'panel',
            bodyStyle: 'padding-top: 10px',
            items: [
                {
                    xtype: 'label',
                    text: 'Telefones para contato',
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
            reference: 'phoneForm',
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
                    fieldLabel: 'DDD',
                    name: 'ddd',
                    plugins: 'textmask',
                    money: false,
                    mask: '999'
                }, {
                    anchor: '100%',
                    fieldLabel: 'Telefone',
                    name: 'phonenumber',
                    plugins: 'textmask',
                    money: false,
                    mask: '99999-9999'
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Operadora',
                    name: 'phoneoperatordescription'
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Tipo de linha',
                    name: 'phonetypedescription'
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Tipo de telefone',
                    name: 'linetypedescription'
                }, {
                    name: 'isdefault',
                    xtype: 'checkboxfield',
                    boxLabel: 'Número principal'
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
                            handler: 'updatePhone'
                        }, {
                            xtype: 'splitter'
                        }, {
                            flex: 1,
                            glyph: 0xe875,
                            text: 'Novo',
                            showSmartTheme: 'red',
                            handler: 'insertPhone'
                        }
                    ]
                }
            ]
        }, {
            region: 'center',
            hideHeaders: false,
            xtype: 'gridpanel',
            name: 'phone',
            store: Ext.create('AppAnest.store.person.PersonPhone'),
            columns: [
                {
                    flex: 1,
                    text: 'Telefones',
                    renderer: function (value,metaData,record) {
                        var ddd = record.get('ddd'),
                            phoneoperator = record.get('phoneoperator'),
                            phonenumber = Smart.maskRenderer('99999-9999',false)(record.get('phonenumber')),
                            linetypedescription = record.get('linetypedescription'),
                            phonetypedescription = record.get('phonetypedescription'),
                            phoneoperatordescription = record.get('phoneoperatordescription');

                        return  '<a class="smart-medium-users-detail">('+ ddd +') '+ phonenumber + ' - ' + linetypedescription +'</a><br/>'+
                        '<a class="smart-medium-users-detail">' + phoneoperator +' ' + phoneoperatordescription +' - ' + phonetypedescription +'</a>';
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