//@charset ISO-8859-1
Ext.define( 'AppAnest.store.person.NaturalPersonDistribution', {
    extend: 'Smart.data.StoreBase',

    alias: 'store.NaturalPersonDistribution',

    storeId: 'naturalpersondistribution',

    model: 'AppAnest.model.person.NaturalPersonDistribution',

    url: 'business/Class/naturalpersondistribution.php'

});