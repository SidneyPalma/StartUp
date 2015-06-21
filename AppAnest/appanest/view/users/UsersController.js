Ext.define( 'AppAnest.view.users.UsersController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.users',

    stores: [
        'AppAnest.store.users.Users'
    ],

    views: [
        'AppAnest.view.users.*'
    ],

    config: {
        control: {
            'userslist': {
            },
            'usersview': {
                afterrender: 'onAfterRenderView'
            },
            'usersview portrait filefield': {
                loadend: 'onLoadEnd'
            }
        }
    },

    routes: {
        'usersview/:id': {
            action: 'getUserId'
        },
        'usernew': {
            action: 'getUserNew'
        }
    },

    url: 'business/Class/users.php',

    onAfterRenderView: function (container) {
        var me = this,
            form = container.down('form'),
            portrait = form.down('portrait'),
            id = form.down('hiddenfield[name=id]').getValue();

        if(!container.xdata) return false;

        form.loadRecord(container.xdata);

        portrait.setUrl(me.url);
        form.down('textfield[name=username]').setReadOnlyColor(id.lenght != 0);
        portrait.beFileData(container.xdata.get('filetype'));

    },

    getUserId: function (id) {
        var app = AppAnest.app.getController('App'),
            record = Ext.getStore('users').findRecord('id',id);

        app.addToMainCenterRegion({xtype: 'usersview', xdata: record});
    },

    onViewEdit: function (btn) {
        var me = this,
            model = btn.getWidgetRecord(),
            store = Ext.getStore('users');

        store.setParams({
            method: 'selectCode',
            rows: Ext.encode({ id: model.get('id') })
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var record = records[0];
                me.redirectTo( 'usersview/' + record.get('id'));
            }
        });
    },

    insertViewNew: function (btn) {
        var me = this;
        me.redirectTo('usernew');
    },

    getUserNew: function() {
        var app = AppAnest.app.getController('App');

        app.addToMainCenterRegion({xtype: 'usersview', xdata: null});
    },

    onSearchClick: function (search, button) {
        var store = Ext.getStore('users');

        store.setParams({
            field: 'username',
            query: search.getValue()
        }).load();
    },

    getCardIndex: function (btn) {
        var me = this,
            userViews = me.lookupReference('userViews');
        userViews.getLayout().setActiveItem(btn.cardIndex);
    },

    onLoadEnd: function (field,file) {
        var portrait = this.lookupReference('portrait');
        field.doFileData(portrait);
    },

    updateView: function (btn) {
        var me = this,
            view = btn.up('usersview'),
            portrait = me.lookupReference('portrait');

        me.setModuleData('users');
        me.setModuleForm(view.down('form'));

        me._success = function () {
            view.down('textfield[name=username]').setReadOnlyColor(true);
        }

        me.updateModule();
    },

    insertView: function (btn) {
        var me = this,
            view = btn.up('usersview'),
            portrait = me.lookupReference('portrait');

        view.down('form').reset();
        view.down('textfield[name=username]').setReadOnlyColor(false);
        portrait.beFileData();
    }

});