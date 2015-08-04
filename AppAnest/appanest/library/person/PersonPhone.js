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
                    xtype: 'comboenum',
                    fieldLabel: 'Tipo de telefone',
                    name: 'linetypedescription'
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Tipo de linha',
                    name: 'phonetypedescription'
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    anchor: '100%',
                    defaultType: 'textfield',
                    items: [
                        {
                            width: 50,
                            fieldLabel: 'DDD',
                            name: 'ddd',
                            plugins: 'textmask',
                            money: false,
                            mask: '999',
                            listeners: {
                                blur: function (field, event, eOpts) {
                                    var personphone = field.up('personphone'),
                                        phonenumber = personphone.down('textfield[name=phonenumber]'),
                                        linetype = personphone.down('hiddenfield[name=linetype]');

                                    phonenumber.setMask('9999-9999');

                                    if(linetype.getValue() == 'C') {
                                        Ext.Ajax.request({
                                            url: 'business/Class/enumtype.php',
                                            params: {
                                                query: field.getValue(),
                                                action: 'select',
                                                method: 'selectMobileDigit'
                                            },
                                            success: function(response){
                                                var result = Ext.decode(response.responseText);
                                                if(result.success == true && result.records != 0) {
                                                    var record = result.rows[0];
                                                    phonenumber.setMask(record.mobiledigit);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }, {
                            xtype: 'splitter'
                        }, {
                            flex: 1,
                            fieldLabel: 'Telefone',
                            name: 'phonenumber',
                            plugins: 'textmask',
                            money: false,
                            mask: '9999-9999'
                        }
                    ]
                }, {
                    anchor: '100%',
                    xtype: 'comboenum',
                    fieldLabel: 'Operadora',
                    name: 'phoneoperatordescription'
                }, {
                    anchor: '100%',
                    height: 80,
                    fieldLabel: 'Descrição',
                    xytpe: 'textareafield',
                    name: 'description'
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
                        var me = this,
                            ddd = record.get('ddd'),
                            phoneoperator = record.get('phoneoperator'),
                            phonenumber = Smart.maskRenderer(record.get('mobiledigit'),false)(record.get('phonenumber')),
                            linetypedescription = record.get('linetypedescription'),
                            phonetypedescription = record.get('phonetypedescription'),
                            phoneoperatordescription = record.get('phoneoperatordescription'),
                            deletepersonphone = record.get('isdefault') ? '' : '<div onClick="Ext.deletepersonphone()" style="float: right; width: 30px; color: rgba(110, 123, 139, .5);"><span class="delete-item" style="font-size: 28px;"><i class="icon-cancel"></i></span></div>';

                        Ext.deletepersonphone = function () {
                            me.up('personphone').onDeletePhone(me, record);
                        };

                        return  '<div style="float: left;"><a class="smart-medium-users-detail">('+ ddd +') '+ phonenumber + ' - ' + linetypedescription +'</a><br/>'+
                                '<a class="smart-medium-users-detail">' + phoneoperator +' ' + phoneoperatordescription +' - ' + phonetypedescription +'</a></div>'+
                                deletepersonphone;
                    }
                }, {
                    width: 70,
                    text: 'Principal',
                    align: 'center',
                    renderer: function (value, meta, rec) {
                        return rec.get('isdefault') ? '<span style="color: rgba(110, 123, 139, .5); width: 20px; font-size: 28px;"><i class="icon-ok-circled"></i></span>' : '';
                    }
                }
            ]
        }
    ],

    onDeletePhone: function (gridpanel, record) {
        var me = this,
            store = gridpanel.store;

        Ext.Msg.show({
            title:'Removendo número de telefone da lista!',
            message: 'Confirma a remoção deste número de telefone?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    store.remove(record);

                    gridpanel.setLoading('Removendo registros...');

                    store.sync({
                        scope: me,
                        success: function (batch, options) {
                            gridpanel.setLoading(false);
                        },
                        failure: function (batch, options) {
                            gridpanel.setLoading(false);
                        }
                    });
                }
            }
        });
    }

});