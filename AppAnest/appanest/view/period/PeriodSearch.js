//@charset ISO-8859-1
Ext.define( 'AppAnest.view.period.PeriodSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.periodsearch',

    pageSize: 0,

    fieldLabel: 'Periodo',

    requires: [
        'AppAnest.store.scheduling.SchedulingPeriod',
    ],

    displayField: 'month',

    store: 'AppAnest.store.scheduling.SchedulingPeriod',

    // template for the content List
    tpl: [
        '<tpl style:"font-size: 14px;" for=".">',
            '<div class="x-boundlist-item">' +
                '<span style="font-size: 17px; color:#3333FF; display: block;">{description}</span>' +
                '<span style="font-size: 14px; color:#990000; display: block;">{periodof} - {periodto}</span>' +
            '</div>',
        '</tpl>'
    ],

    // template for the content displayField
    displayTpl: [
        '<tpl for=".">',
            '{periodof} - {periodto}',
        '</tpl>'
    ]

});
