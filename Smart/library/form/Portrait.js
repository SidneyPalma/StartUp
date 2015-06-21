//@charset ISO-8859-1
Ext.define( 'Smart.form.Portrait', {
    extend: 'Ext.form.Panel',
    
    alias: 'widget.portrait',

    requires: [
        'Smart.Resource',
        'Ext.form.field.File',
        'Ext.form.field.Hidden'
    ],

    config: {
        url: null,
        tableName: null
    },

    layout: 'fit',

    bodyCls: 'smart-portrait',

    fileImage: 'anest',
    reference: 'portrait',

    beFileData: function (image) {
        var me = this,
            fileData = image || Smart.Resource.getFileImage(me.fileImage);
        me.down('component').update(Ext.String.format('<div><img src="{0}"></div>',fileData));
    },

    initComponent: function () {
    	var me = this;
        me.buildItems();
        me.callParent();
        me.beFileData();
    },

    buildItems: function () {
        var me = this;

        me.items = [
            {
                xtype: 'panel',
                buttonAlign: 'center',
                items: [
                    {
                        xtype: 'component'
                    }
                ],
                buttons: [
                    {
                        xtype: 'filefield',
                        name: 'filedata',
                        width: 34,
                        minWidth: 34,
                        buttonOnly: true,
                        buttonConfig: {
                            width: 34,
                            minWidth: 34,
                            glyph: 0xe813,
                            showSmartTheme: 'red'
                        },
                        accept: 'image/*',
                        buttonText: Ext.emptyText
                    }, {
                        scope: me,
                        minWidth: 34,
                        glyph: 0xef68,
                        showSmartTheme: 'red',
                        handler: me.removePortrait
                    }
                ]
            }
        ];
    },

    afterRender: function () {
        var me = this;

        if (me.tableName) {

            me.add(Ext.widget('hiddenfield', {name: 'fieldData', value: undefined}));
            me.add(Ext.widget('hiddenfield', {name: 'tableName', value: me.tableName}));
        }

        me.callParent(arguments);
    },

    getRecordId: function () {
        var me = this;

        return me.up('form').down('hiddenfield[name=id]').getValue();
    },

    submitPortrait: function () {
        var me = this;

        if(!me.down('filefield').isModified) return false;

        me.submit({
            scope: me,
            url: me.url,
            params: {
                action: 'upload',
                method: 'saveFile'
            },
            success: function(form, action) {
                me.down('filefield').reset();
                me.down('filefield').isModified = false;
            },
            failure: function(form, action) {
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
    },

    removePortrait: function () {
        var me = this;

        Ext.Msg.show({
            scope: me,
            title:'Remover conteudo!',
            message: 'Confirma a operação de remoção?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    me.submit({
                        scope: me,
                        url: me.url,
                        params: {
                            action: 'upload',
                            method: 'nullFile',
                            id: me.getRecordId(),
                            tableName: me.getTableName()
                        },
                        success: function(form, action) {
                            me.beFileData();
                            me.down('filefield').reset();
                            me.down('filefield').isModified = false;
                        },
                        failure: function(form, action) {
                            console.info(action.result.text);
                        }
                    });
                } 
            }
        });
    }

});