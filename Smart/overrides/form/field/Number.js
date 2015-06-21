Ext.define( 'Ext.overrides.form.field.Number', {
    override: 'Ext.form.field.Number',

    //currencyField: false,

    afterRender: function() {
        this.inputEl.setStyle('text-align', 'right');
        this.callParent(arguments);
    }

    //initComponent: function () {
    //    var me = this;
    //
    //    me.callParent(arguments);
    //
    //    if(me.currencyField === true ) {
    //        me.minValue = 0;
    //        me.hideTrigger = true;
    //
    //        me.setValue = function(v) {
    //            this.callParent(arguments);
    //            if (!Ext.isEmpty(this.getValue())) {
    //                this.setRawValue(Ext.util.Format.currency(this.getValue()));
    //            }
    //        }
    //
    //        // Override parseValue to remove the currency format
    //        me.parseValue = function(v) {
    //            return this.callParent([this.removeFormat(v)]);
    //        }
    //
    //        // Remove the format before validating the value
    //        me.getErrors = function(v) {
    //            return this.callParent([this.removeFormat(v)]);
    //        }
    //
    //        /* Override getSubmitData to remove the currency format on the value
    //            that will be passed out from the getValues method of the form */
    //        me.getSubmitData = function() {
    //            var returnObject = {};
    //            returnObject[this.name] = this.removeFormat(this.callParent(arguments)[this.name]);
    //            return returnObject;
    //        }
    //
    //        // Override preFocus to remove the format during edit
    //        me.preFocus = function() {
    //            this.setRawValue(this.removeFormat(this.getRawValue()));
    //            this.callParent(arguments);
    //        }
    //
    //    }
    //
    //},
    //
    //removeFormat: function(v) {
    //    if (Ext.isEmpty(v)) {
    //        return '';
    //    } else {
    //        v = v.toString().replace(Ext.util.Format.currencySign, '').replace(Ext.util.Format.thousandSeparator, '');
    //        if (v % 1 === 0) {
    //            // Return value formatted with no precision since there are no digits after the decimal
    //            return Ext.util.Format.number(v, '0');
    //        } else {
    //            // Return value formatted with precision of two digits since there are digits after the decimal
    //            return Ext.util.Format.number(v, '0.00');
    //        }
    //    }
    //}

});