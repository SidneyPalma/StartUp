Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Smart.ux': 'library/ux',
        'Smart.app': 'library/app',
        'Smart.util': 'library/util',
        'Smart.data': 'library/data',
        'Smart.data.field': 'library/data/field',
        'Smart.home': 'library/home',
        'Smart.form': 'library/form',
        'Smart.form.field': 'library/form/field',
        'Smart.plugins': 'library/plugins',
        'Smart.address': 'library/address',
        'AppAnest.person': 'library/person'
    }
});

Ext.application({
    name: 'AppAnest',

    extend: 'AppAnest.Application',
    
    autoCreateViewport: 'AppAnest.view.main.Main'
});
