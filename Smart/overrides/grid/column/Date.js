Ext.define( 'Ext.overrides.grid.column.Date', {
    override: 'Ext.grid.column.Date',

    format: 'd/m/Y',

    renderer: function (value) {
        return Ext.util.Format.date(Ext.Date.parse(value,"Y-m-d"),'d/m/Y');
    }

});