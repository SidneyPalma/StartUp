Ext.define( 'AppAnest.view.main.MainDock', {
    extend: 'Ext.panel.Panel',

    xtype: 'maindock',

    controller: 'main',

    //cls: 'appanest-title',

    bodyStyle: {
        //'background':'-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #89c403), color-stop(1, #77a809));',
        //'background':'-moz-linear-gradient(top, #89c403 5%, #77a809 100%);',
        //'background':'-webkit-linear-gradient(top, #89c403 5%, #77a809 100%);',
        //'background':'-o-linear-gradient(top, #89c403 5%, #77a809 100%);',
        //'background':'-ms-linear-gradient(top, #89c403 5%, #77a809 100%);',
        //'background':'linear-gradient(to bottom, #89c403 5%, #77a809 100%);',
        //'filter':'progid:DXImageTransform.Microsoft.gradient(startColorstr="#89c403", endColorstr="#77a809",GradientType=0);',
        //'background-color':'#89c403;',
        'background-color': 'rgba(31, 31, 31, 1)', //'#1f1f1f',
        'display':'inline-block;',
        'cursor':'pointer;',
        'color':'#ffffff;',
        'font-family':'arial;',
        'font-size':'15px;',
        'font-weight':'bold;',
        'padding':'0px 10px;',
        'text-decoration':'none;'
    },

    hidden: true,

    layout: {
        type: 'hbox',
        align: 'middle'
    },

    items: [
        {
            width: 150,
            xtype: 'component',
            cls: 'appanest-logo-text'
        }, {
            xtype: 'splitter'
        }, {
            xtype: 'component',
            flex: 1
        }, {
            xtype: 'splitter'
        }, {
            height: 50,
            width: 200,
            name: 'avatar',
            xtype: 'container'
        }, {
            xtype: 'splitter'
        }, {
            scale: 'medium',
            xtype: 'button',
            name: 'logout',
            glyph: 0xe918, //0xe918 0xefce
            showSmartTheme: 'red-dark'
        }
    ]

});