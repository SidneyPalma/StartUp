//@charset ISO-8859-1
Ext.define( 'AppAnest.controller.App', {
    extend: 'Ext.app.Controller',

    alias: 'controller.app',

    views: [
        'main.*'
    ],

    url: 'business/Class/users.php',

    init: function() {
        var me = this;

        me.addRef([
            {
                ref: 'MainPage',
                selector: 'main'
            }, {
                ref: 'MainHome',
                selector: 'home'
            }, {
                ref: 'MainTool',
                selector: 'maintool'
            }, {
                ref: 'MainDock',
                selector: 'maindock'
            }
        ]);

        me.control({
            'main': {
            },
            'main maindock': {
                render: 'onRenderDockEar',
                clickdockear: 'onClickDockEar'
            },
            'main maintool': {
                render: 'onRenderToolEar',
                clicktoolear: 'onClickToolEar'
            },
            'main home button[name=comein]': {
                click: 'setUserComein'
            },
            'main home textfield[name=password]': {
                specialkey: 'onPasswordEnter'
            },
            'main home button[name=forgot]': {
                click: 'setUserForgot'
            },
            'main home button[name=invite]': {
                click: 'setUserInvite'
            },
            'main maindock button[name=logout]': {
                click: 'setUserLogout'
            },
            'main maintool treepanel[name=moduletask]': {
                select: 'onSelectModuleTask'
            },
            //'main mainstatusbar button[name=quit]': {
            //    click: 'onClickQuit'
            //},
            //'main mainstatusbar button[name=swap]': {
            //    click: 'onClickSwap'
            //},
            'home': {
                afterrender: 'onAfterRender'
            },
            'main homecomein': {
                loginforgot: 'onLoginForgot',
                logininvite: 'onLoginInvite'
            },
            'main homeforgot': {
                logincomein: 'onLoginComein'
            },
            'main homeinvite': {
                logincomein: 'onLoginComein'
            }
        });

        me.callParent();
    },

    routes: {
        'home': {
            action: 'setMainHome'
        },
        'userslist': {
            action: 'setUserList'
        },
        'naturalpersonlist': {
            action: 'setNaturalPersonList'
        },
        'contractorlist': {
            action: 'setContractorList'
        },
        'legalentitylist': {
            action: 'setLegalEntityList'
        },
        'contractorunitlist': {
            action: 'setContractorUnitList'
        },
        'enumtypelist': {
            action: 'setEnumTypeList'
        },
        'shifttypelist': {
            action: 'setShiftTypeList'
        },
        'contractlist': {
            action: 'setContractList'
        },
        'mapplanning': {
            action: 'setMapPlanning'
        },
        'schedulingplanning': {
            action: 'setSchedulingPlanning'
        },
        'allocationschema': {
            action: 'setAllocationSchema'
        }
    },

    onRenderDockEar: function (component, eOpts) {
        var me = this,
            mainDock = me.getMainDock(),
            dockHide = Ext.getBody().getById('appanest-dock-ear');


        dockHide.on('click', function(){ mainDock.fireEvent('clickdockear', mainDock, dockHide, eOpts); }, mainDock);
    },

    onClickDockEar: function (maindock) {
        var dockShow = Ext.getBody().getById('dock-hide-show');

        maindock.slideSwap();

        if(maindock.collapsed) {
            dockShow.replaceCls('icon-up-big','icon-down-big');
        } else {
            dockShow.replaceCls('icon-down-big','icon-up-big');
        }
    },

    onRenderToolEar: function (component, eOpts) {
        var me = this,
            mainTool = me.getMainTool(),
            toolHide = Ext.getBody().getById('appanest-tool-ear');

        toolHide.on('click', function(){ mainTool.fireEvent('clicktoolear', mainTool, toolHide, eOpts); }, mainTool);
    },

    onClickToolEar: function (maintool) {
        var toolShow = Ext.getBody().getById('tool-hide-show');

        maintool.slideSwap();

        if(maintool.collapsed) {
            toolShow.replaceCls('icon-left-big','icon-right-big');
        } else {
            toolShow.replaceCls('icon-right-big','icon-left-big');
        }
    },

    onSelectModuleTask: function(rowModel, record) {
        var me = this,
            router = record.get('router');
        if(router) {
            me.redirectTo( router );
            //rowModel.deselectAll(true);
        }
    },

    onAfterRender: function (home) {
        var cfg = {title: 'AppAnest', message: '2015 © yendis.palma'};
        home.setAppDefaults(cfg);
    },

    setUserLogout: function (btn) {
        var me = this;

        me.getMainPage().setLoading('Encerrando sessão do usuário atual!');

        Ext.Ajax.request({
            scope: me,
            url: me.url,
            params: {
                action: 'select',
                method: 'selectLogout'
            },
            success: function(){
                location.reload(true);
                me.getMainPage().setLoading(false);
            }
        });
    },

    onPasswordEnter: function (field, e) {
        var me = this,
            btn = field.up('form[name=comein]').down('button[name=comein]');
        if (e.getKey() === e.ENTER) {
            me.setUserComein(btn);
        }
    },

    setUserComein: function (btn) {
        var me = this,
            fm = btn.up('form[name=comein]'),
            userlogin = btn.up('container[name=userlogin]');

        if(!fm.isValid()) {
            return false;
        }

        fm.up('home').setLoading('Autenticando usuário...');

        fm.submit({
            clientValidation: true,
            url: me.url,
            params: {
                action: 'select',
                method: 'selectComein',
                rows: Ext.encode(fm.getValues()),
                fields: Ext.encode(['id','username','fullname','password', 'filedata', 'fileinfo', 'isactive'])
            },
            success: function(form, action) {
                var result = action.result;
                fm.up('home').setLoading(false);
                fm.reset();
                userlogin.setVisible(!result.success);
                me.getMainTool().setVisible(result.success);
                me.getMainDock().setVisible(result.success);

                if(result.success === true) {

                    var avatar = me.getMainDock().down('container[name=avatar]'),
                        usrimage = Ext.String.format('data:image/jpg;base64,{0}',result.rows[0].filedata);

                    avatar.update(
                        '<div style="height: 50px; font-family: Open Sans;">' +
                            '<img style="float: left; width: 50px; padding: 7px;" class="smart-medium-users-filedata" src="'+usrimage+'">' +
                            '<div style="float: left; height: 100%; line-height: 50px; font-size: 18px;">'+result.rows[0].username+'</div>' +
                        '</div>'
                    );

                    Ext.Ajax.request({
                        url: 'business/Class/users.php',
                        params: {
                            action: 'select',
                            method: 'selectUserModule'
                        },
                        success: function(response){
                            var root = Ext.decode(response.responseText);
                            var dockEar = Ext.getBody().getById('appanest-dock-ear');
                            var toolEar = Ext.getBody().getById('appanest-tool-ear');
                            dockEar.replaceCls('appanest-ear-hide','bounceInDown');
                            toolEar.replaceCls('appanest-ear-hide','bounceInLeft');
                            me.getMainTool().down('treepanel').setRootNode(root);
                        }
                    });
                }
            },
            failure: function(form, action) {
                fm.up('home').setLoading(false);
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
    
    setUserForgot: function (btn) {
        var me = this,
            fm = btn.up('form[name=forgot]'),
            userlogin = btn.up('container [name=userlogin]');

        if(!fm.isValid()) {
            return false;
        }

        fm.up('home').setLoading('Gerando senha convite...');

        fm.submit({
            clientValidation: true,
            url: me.url,
            params: {
                action: 'select',
                method: 'selectUserForgot',
                rows: Ext.encode(fm.getValues())
            },
            success: function(form, action) {
                fm.up('home').setLoading(false);
                fm.reset();
                userlogin.getLayout().setActiveItem(0);
            },
            failure: function(form, action) {
                fm.up('home').setLoading(false);
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
    
    setUserInvite: function (btn) {
        var me = this,
            fm = btn.up('form[name=invite]'),
            userlogin = btn.up('container [name=userlogin]');

        if(!fm.isValid()) {
            return false;
        }

        fm.up('home').setLoading('Registrando senha convite...');

        fm.submit({
            clientValidation: true,
            url: me.url,
            params: {
                action: 'select',
                method: 'selectUserInvite',
                rows: Ext.encode(fm.getValues())
            },
            success: function(form, action) {
                fm.up('home').setLoading(false);
                fm.reset();
                userlogin.getLayout().setActiveItem(0);
            },
            failure: function(form, action) {
                fm.up('home').setLoading(false);
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

    onClickQuit: function (btn) {
        var me = this,
            main = btn.up('main'),
            app = Whocall.app.getController('App');
               
        Ext.Ajax.request({
            scope: me,
            url: me.url,
            params: {
                action: 'logout'
            },
            success: function(response) {
                me.redirectTo('home');
                app.getMainToolBar().setVisible(false);
                app.getMainStatusBar().setVisible(false);
                var userlogin = main.down('container[name=userlogin]');
                if(userlogin) userlogin.setVisible(true);
            }
        });
    },

    onClickSwap: function (btn) {
        var toolbar = btn.up('main').down('maintoolbar');
        toolbar.slideSwap();
    },

    onLoginForgot: function (homecomein) {
        var userlogin = homecomein.up('container [name=userlogin]');
        var layout = userlogin.getLayout();
            layout.setActiveItem(1);
    },
    
    onLoginInvite: function (homecomein) {
        var userlogin = homecomein.up('container [name=userlogin]');
        var layout = userlogin.getLayout();
            layout.setActiveItem(2);
    },

    onLoginComein: function (homeforgot) {
        var userlogin = homeforgot.up('container [name=userlogin]');
        var layout = userlogin.getLayout();
            layout.setActiveItem(0);
    },

    addToMainCenterRegion: function(config, fn) {
        var mainPage = this.getMainPage(),
            center = mainPage.layout.centerRegion,
            cmp = center.down(config.xtype),
            updateRegion = function () {
                center.removeAll();
                cmp = center.add( config );

                if (Ext.isFunction( fn ) == true) {
                    fn();
                }
            };

        if(center.items.getCount()) {
            var panelCenter = center.down(center.items.getAt(0));
            center.down(panelCenter.xtype).removeCls(panelCenter.animateClsIn);
            center.down(panelCenter.xtype).addCls(panelCenter.animateClsOut);
            Ext.defer(function () { updateRegion(); }, 300);
        } else updateRegion();

        return cmp;
    },

    // app routes    
    setMainHome: function () {
        var me = this;

        Ext.Ajax.request({
            scope: me,
            url: me.url,
            params: {
                action: 'select',
                method: 'selectOpened'
            },
            success: function(response){
                var result = Ext.decode(response.responseText);

                me.addToMainCenterRegion({
                    xtype: 'home',
                    opened: result.success
                });

                me.getMainTool().setVisible(result.success);
                me.getMainDock().setVisible(result.success);

                if(result.success === true) {

                    var avatar = me.getMainDock().down('container[name=avatar]'),
                        usrimage = Ext.String.format('data:image/jpg;base64,{0}',result.rows[0].filedata);

                    avatar.update(
                        '<div style="height: 50px; font-family: Open Sans;">' +
                            '<img style="float: left; width: 50px; padding: 7px;" class="smart-medium-users-filedata" src="'+usrimage+'">' +
                            '<div style="float: left; height: 100%; line-height: 50px; font-size: 18px;">'+result.rows[0].username+'</div>' +
                        '</div>'
                    );

                    Ext.Ajax.request({
                        url: 'business/Class/users.php',
                        params: {
                            action: 'select',
                            method: 'selectUserModule'
                        },
                        success: function(response){
                            var root = Ext.decode(response.responseText);
                            var dockEar = Ext.getBody().getById('appanest-dock-ear');
                            var toolEar = Ext.getBody().getById('appanest-tool-ear');
                            dockEar.replaceCls('appanest-ear-hide','bounceInDown');
                            toolEar.replaceCls('appanest-ear-hide','bounceInLeft');
                            me.getMainTool().down('treepanel').setRootNode(root);
                        }
                    });
                }
            }
        });
    },

    setUserList: function () {
        this.addToMainCenterRegion({ xtype: 'userslist' });
    },

    setNaturalPersonList: function () {
        this.addToMainCenterRegion({ xtype: 'naturalpersonlist' });
    },

    setLegalEntityList: function () {
        this.addToMainCenterRegion({ xtype: 'legalentitylist' });
    },

    setContractorList: function () {
        this.addToMainCenterRegion({ xtype: 'contractorlist' });
    },

    setContractorUnitList: function () {
        this.addToMainCenterRegion({ xtype: 'contractorunitlist' });
    },

    setEnumTypeList: function () {
        this.addToMainCenterRegion({ xtype: 'enumtypelist' });
    },

    setShiftTypeList: function () {
        this.addToMainCenterRegion({ xtype: 'shifttypelist' });
    },
	
	setContractList: function () {
        this.addToMainCenterRegion({ xtype: 'contractlist' });
    },

    setMapPlanning: function () {
        this.addToMainCenterRegion({ xtype: 'mapplanning' });
    },

    setSchedulingPlanning: function () {
        this.addToMainCenterRegion({ xtype: 'schedulingplanning' });
    },

    setAllocationSchema: function () {
        this.addToMainCenterRegion({ xtype: 'allocationschema' });
    }

});