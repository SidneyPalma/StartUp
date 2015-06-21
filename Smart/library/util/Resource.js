Ext.define( 'Smart.util.Resource', {

    singleton: true,

    alternateClassName: ['Smart.Rss', 'Smart.Resource'],

    getFileImage: function (image) {
        var local = {
            smart: 'resources/images/smart/defaults/smart.png',
            users: 'resources/images/smart/defaults/users.png',
            docto: 'resources/images/smart/defaults/docto.png',
            anest: 'resources/images/smart/defaults/anest.png'
        };

        return ( local[image] || local.anest );
    },

    getIconFile: function (fileType) {
        var file = {
            contract: 'data:image/png;base64,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',
            additive: 'data:image/png;base64,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',
            internal: 'data:image/png;base64,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'
        };

        return ( file[fileType] || file.internal );
    },

    getColor: function (color) {
        var me = this;
        return me._colors[color];
    },

    _getSizeCls: function (iconCls, toSize) {
        var regex = new RegExp(/([0-9]+)/),
            size = regex.exec(iconCls);
        return iconCls.replace(size[1],toSize);
    },

    _colors: {
        red     : 'color:#E82700;',
        blue    : 'color:#3333FF;',
        white   : 'color:#FFFFFF;',
        green   : 'color:#197D19;',
        sepia   : 'color:#F7F3DF;',
        yellow  : 'color:#EDD500;',
        orange  : 'color:#F55C2E;',
        salmon  : 'color:#F2E191;'
    },

    getStyleTitleH1: function () {
        return 'color: blue; font-size: 14px; padding-bottom: 5px;';
    },

    getGlyphTpl: function (msgRequire,clsGlyph) {
        var cls = clsGlyph || 'icon-info-2',
            require = msgRequire || 'Obrigatório';
    
        return Ext.String.format('<span class="{0}" style="color:red;" data-qtip="{1}"></span>', cls, require);
    }

});