Ext.define(	'AppAnest.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'AppAnest.view.main.*'
    ],

    config: {
        control: {
            'main': {
                resize: 'onAppMainResize',
                beforerender: 'onAppMainBeforerender'
            }
        }
    },

    onAppMainBeforerender: function (viewport) {
        //window.innerHeight += 500;
    },

    onClickSwap: function (btn) {
        var toolbar = btn.up('main').down('maintool');
        toolbar.slideSwap();
    },

    onAppMainResize: function (viewport, width, height, oldWidth, oldHeight, eOpts ) {
        var pSize = (width < 768),
            wSize = (width >= 768),
            newSize = (width !== oldWidth),
            toolbar = viewport.down('maintool');

        if(newSize) {
            if(pSize && toolbar.collapsed === false ) {
                toolbar.slideHide();
            }
            if(wSize && toolbar.collapsed !== false ) {
                toolbar.slideShow();
            }
        }
    },

    onSearchClick: function (btn) {
        Ext.Ajax.request({
            url: 'business/Class/Users.php',
            params: {
                action: 'select',
                method: 'selectUserModule'
            },
            success: function(response){
                var text = response.responseText;
                console.info(text);
            }
        });
    },

    selectTask: function (rowModel, record, index, eOpts) {
        console.info(rowModel);
    }

});
