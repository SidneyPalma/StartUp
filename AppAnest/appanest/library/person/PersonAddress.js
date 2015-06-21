//@charset ISO-8859-1
Ext.define( 'AppAnest.person.PersonAddress', {
    extend: 'Ext.panel.Panel',

    xtype: 'personaddress',

    requires: [
        'Smart.fields.*',
        'Smart.address.*',
        'Smart.form.field.ComboEnum'
    ],

    layout: 'anchor',

    reference: 'address',

    overflowY: 'auto',
    glyph: 0xe9d5,
    title: 'Endereço',

    bodyStyle: 'padding-top: 10px',

    items: [
        {
            xtype: 'label',
            text: 'Logradouro',
            style: {
                color: 'blue;',
                fontSize: '14px;'
            }
        },{
            xtype: 'container',
            layout: 'hbox',
            defaultType: 'textfield',
            items: [
                {
                    flex: 5,
                    xtype: 'textaddress',
                    fieldLabel: 'Rua/avenida/estrada',
                    name: 'address'
                }, {
                    xtype: 'splitter'
                }, {
                    width: 160,
                    fieldLabel: 'Número',
                    name: 'addressnumber'
                }
            ]
        }, {
            anchor: '100%',
            fieldLabel: 'Complemento',
            name: 'addresscomplement'
        }, {
            xtype: 'container',
            layout: 'hbox',
            defaultType: 'textfield',
            items: [
                {
                    flex: 5,
                    fieldLabel: 'Bairro',
                    name: 'addressneighborhood'
                }, {
                    xtype: 'splitter'
                }, {
                    width: 160,
                    fieldLabel: 'Cep',
                    xtype: 'maskzipcode',
                    name: 'addresszipcode'
                }
            ]
        }, {
            xtype: 'container',
            layout: 'hbox',
            defaultType: 'textfield',
            items: [
                {
                    flex: 4,
                    fieldLabel: 'Complemento',
                    name: 'addresscomplement'
                }, {
                    xtype: 'splitter'
                }, {
                    flex: 3,
                    fieldLabel: 'Cidade',
                    name: 'addresslocality'
                }, {
                    xtype: 'splitter'
                }, {
                    width: 160,
                    xtype: 'comboenum',
                    fieldLabel: 'Estado',
                    name: 'addressfederationunitdescription'
                }
            ]
        }
    ]

});