Ext.define( 'Smart.app.ViewControllerBase', {
    extend: 'Ext.app.ViewController',

    /**
     * For use in afterrender, from ContainerList(pesquisa)
     * @param panel
     * @param eOpts
     */
    onFocusSearch: function (container, eOpts) {
        var me = this;
        me.lookupReference('search').focus(false, 200);
    },

    getDateFormated: function (date) {
        var stringDate = '{0} de {1} de {2}',
            monthNames = [
                "Janeiro", "Fevereiro", "Março",
                "Abril", "Maio", "Junho", "Julho",
                "Agosto", "Setembro", "Outubro",
                "Novembro", "Dezembro"
            ],
            day = date.getDate(),
            monthIndex = date.getMonth(),
            year = date.getFullYear();

        return Ext.String.format(stringDate,day, monthNames[monthIndex], year);
    }

});