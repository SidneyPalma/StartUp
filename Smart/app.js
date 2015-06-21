Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Smart.ux': 'library/ux',
        'Smart.app': 'library/app',
        'Smart.plugins': 'library/plugins',
        'Smart.class': 'library/util',
        'Smart.data': 'library/data',
        'Smart.data.field': 'library/data/field',
        'Smart.home': 'library/home',
        'Smart.form': 'library/form',
        'Smart.form.field': 'library/form/field'
    }
});

Ext.application({
    name: 'Smart',

    extend: 'Smart.Application',

    autoCreateViewport: 'Smart.view.main.Main'

});