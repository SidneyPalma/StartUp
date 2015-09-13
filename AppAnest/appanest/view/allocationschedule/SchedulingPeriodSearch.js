//@charset ISO-8859-1
Ext.define( 'AppAnest.view.allocationschedule.SchedulingPeriodSearch', {
    extend: 'Smart.form.field.ComboSearch',

    alias: 'widget.schedulingperiodsearch',

    pageSize: 0,
    editable: false,

    requires: [
        'AppAnest.store.allocationschedule.SchedulingPeriod'
    ],

    params: 'all',

    fieldLabel: 'Periodo',

    displayField: 'description',

    store: 'AppAnest.store.allocationschedule.SchedulingPeriod',

    // template for the content List
    tpl: [
        '<tpl style:"font-size: 14px;" for=".">',
            '<div class="x-boundlist-item">' +
                '<span style="font-size: 17px; color:#3333FF; display: block; font-family: Monda;">{description}</span>' +
                '<span style="font-size: 14px; color:#990000; display: block; font-family: Monda;">{periodof} - {periodto}</span>' +
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
