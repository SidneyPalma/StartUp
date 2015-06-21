Ext.define( 'Ext.overrides.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',

    inputValue    : true,
    uncheckedValue: false

    //getSubmitValue: function() {
    //    return this.checked ? this.inputValue : this.uncheckedValue;
    //},

    //getSubmitValue: function() {
    //    var unchecked = this.uncheckedValue,
    //        uncheckedVal = Ext.isDefined(unchecked) ? unchecked : null;
    //    return this.checked ? this.inputValue : uncheckedVal;
    //},

    //listeners: {
    //    change: function ( field, newValue, oldValue, eOpts ) {
    //        field.checkDirty();
    //        field.dirty = true;
    //    }
    //}

});