Ext.define( 'Ext.overrides.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',

    time: function (val, field) {
        return /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/.test(val);
    },
    timeText: 'Not a valid time. Must be in the format "23:59".',
    timeMask: /[\d\s:amp]/i,
    
    IPAddress:  function(val, field) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(val);
    },
    IPAddressText: 'Must be a numeric IP address',
    IPAddressMask: /[\d\.]/i,

    cpf: function (val, field) {
        var Soma, Resto;

        Soma = 0;
        if (val == "00000000000") return false;
        if (val == "11111111111") return false;
        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(val.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(val.substring(9, 10))) return false;
        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(val.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(val.substring(10, 11))) return false;

        return true;
    },
    cpfText: 'No valid CPF. Must be a CPF in the format: 000.000.000-00'

});