//@charset ISO-8859-1
Ext.define( 'AppAnest.view.planning.MapPlanningController', {
    extend: 'Smart.app.ViewControllerBase',

    alias: 'controller.mapplanning',


    url: 'business/Class/additiveshift.php',

    onItemDblClick: function (view, record, item, index, e, eOpts) {
        var me = this,
            view = me.getView(),
            positioncute = view.down('numberfield[name=positioncute]');

        positioncute.setValue(record.get('position'));

        me.setProcessMap();

    },

    setProcessMap: function () {
        var me = this,
            view = me.getView(),
            fm = view.down('form'),
            param = fm.getValues(),
            panel = me.lookupReference('contractorunitmap'),
            store = panel.getStore(),
            storeList = me.lookupReference('contractorunitlist').getStore();

        param.action = 'select';
        param.method = 'selectChart';

        view.setLoading('Processando ...');

        store.setParams(param).load({
            scope: me,
            callback: function(records, operation, success) {
                var getFields = function () {
                    var fields = [], i,
                        dutyamount = storeList.sum('dutyamount');

                    for (i = 1; i <= dutyamount; i++) {
                        fields.push({
                            text: i,
                            align: 'center',
                            dataIndex: 'week'  + Ext.String.leftPad(i, 2, '0'),
                            width: 30,
                            renderer: function (value, meta, rec, rowIndex) {
                                meta.style = (parseInt(rowIndex) == parseInt(param.positioncute)) ? 'background-color: rgb(248, 202, 0)' : '';
                                return value;
                            }
                        });
                    }

                    return fields;
                };

                view.setLoading(false);

                panel.reconfigure(store, [
                    {
                        locked: true,
                        text: '<a style="color: blue; font-size: 18px; font-family: Monda;">' + 'U N I D A D E S' + '</a>',
                        align: 'center',
                        columns: [
                            {
                                text: '##',
                                align: 'center',
                                dataIndex: 'position',
                                width: 40
                            }, {
                                align: 'left',
                                text: 'Unidade',
                                dataIndex: 'contractorunit',
                                width: 120
                            }
                        ]
                    }, {
                        align: 'center',
                        text: '<a style="color: blue; font-size: 18px; font-family: Monda;">' + 'S E M A N A S' + '</a>',
                        columns: getFields()
                    //}, {
                    //    flex: 1,
                    //    align: 'center',
                    //    text: '<a style="color: blue; font-size: 18px; font-family: Monda;">' + '###' + '</a>'
                    }
                ]);

                panel.updateLayout();
            }
        });

        //view.setLoading('Processando ...');
        //
        //fm.submit({
        //    scope: me,
        //    url: me.url,
        //    params:  {
        //        action: 'select',
        //        method: 'selectChart'
        //    },
        //    clientValidation: true,
        //    submitEmptyText: false,
        //    success: function(form, action) {
        //        view.setLoading(false);
        //    },
        //    failure: function(form, action) {
        //        view.setLoading(false);
        //    }
        //});
    },

    onFilterWeekDay: function ( queryPlan, eOpts ) {
        var combo = queryPlan.combo,
            store = combo.store;

        store.clearFilter();
        store.filter('weekday',/(^mon)|(^tue)|(^wed)|(^thu)|(^fri)/);
    },

    onSelectWeekDay: function ( combo, record, eOpts ) {
        var me = this,
            view = me.getView(),
            panel = me.lookupReference('contractorunitmap'),
            positioncute = view.down('numberfield[name=positioncute]'),
            store = me.lookupReference('contractorunitlist').getStore();

        panel.getStore().removeAll();

        store.setParams({
            action: 'select',
            method: 'selectList',
            weekday: record.get('weekday')
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var recNew = store.findRecord('position',positioncute.getValue());
                recNew.set('positioncute',1);
                recNew.commit();
                positioncute.setMaxValue(store.getCount());
            }
        });
    },

    onChangeCute: function ( field, newValue, oldValue, eOpts ) {
        var me = this,
            grid = me.lookupReference('contractorunitlist'),
            store = grid.getStore(),
            recOld = store.findRecord('position',oldValue),
            recNew = store.findRecord('position',newValue);

        if(recNew && recOld) {
            recOld.set('positioncute',0);
            recOld.commit();
            recNew.set('positioncute',1);
            recNew.commit();
        }
    },

    onRenderGridUnit: function ( grid, eOpts ) {
        var me = this,
            view = me.getView(),
            store = grid.getStore(),
            positioncute = view.down('numberfield[name=positioncute]');

        store.setParams({
            action: 'select',
            method: 'selectList'
        }).load({
            scope: me,
            callback: function(records, operation, success) {
                var recNew = store.findRecord('position',positioncute.getValue());
                if(recNew) {
                    recNew.set('positioncute',1);
                    recNew.commit();
                }
                positioncute.setMaxValue(store.getCount());
            }
        });
    }

});