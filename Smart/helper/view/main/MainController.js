Ext.define( 'Smart.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    config: {
        control: {
            'main combobox': {
                select: 'onSelectTable'
            }
        }
    },


    onSelectTable: function ( combo, record, eOpts ) {
        var me = this,
            form = combo.up('form'),
            grid = form.down('gridpanel'),
            classname = form.down('textfield[name=model]');

        if(!form.isValid()) {
            return false;
        }

        form.setLoading('Carregando ...');

        grid.store.setParams({
            query: classname.getValue(),
            action: 'selectFields'
        }).load({
            callback: function() {
                form.setLoading(false);
            }
        });
    },

    doConfirm: function (btn) {
        var me = this,
            rows = [],
            form = btn.up('form'),
            store =  form.down('gridpanel').store;

        if(form.isValid() && store.getCount() !== 0) {
            store.each(function (record,index) {
                rows.push(record.data);
            },me);
        }

        if(rows.length !== 0 ) {

            form.setLoading('Criando classes ...');

            form.submit({
                scope: me,
                url: store.getUrl(),
                params: {
                    rows: Ext.encode(rows),
                    action: 'createClasse'
                },
                success: function(frm, action) {
                    form.setLoading(false);
                },
                failure: function(frm, action) {
                    form.setLoading(false);
                    switch (action.failureType) {
                        case Ext.form.action.Action.CLIENT_INVALID:
                            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                            break;
                        case Ext.form.action.Action.CONNECT_FAILURE:
                            Ext.Msg.alert('Failure', 'Ajax communication failed');
                            break;
                        case Ext.form.action.Action.SERVER_INVALID:
                            Ext.Msg.alert('Failure', action.result.text);
                            break;
                    }
                }
            });
        }
    },

    changeFields: function (btn) {
        var me = this,
            win = btn.up('window'),
            frm = win.down('form');

        Ext.Object.each(frm.getValues(), function(key, value) {
            win.xdata.set(key,value);
        });

        win.xdata.commit();

        me.doClose(btn);
    },

    resetFields: function (btn) {
        var me = this,
            win = btn.up('window'),
            frm = win.down('form');

        frm.reset();
        me.changeFields(btn);
    },

    doClose: function (btn) {
        btn.up('window').close();
    }

});
