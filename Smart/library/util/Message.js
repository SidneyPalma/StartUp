Ext.define( 'Smart.util.Message', {

    singleton: true,

    alternateClassName: ['Smart.Msg', 'Smart.Message'],

    get: function (id, msg) {
        return msg;
//        return Smart.App.getName()+'.'+msg;
    },

    getDate: function () {
        var dt = new Date(),
            addZero = function (i) { if (i < 10) { i = '0' + i; } return i; },
            y = addZero(dt.getUTCFullYear()),
            m = addZero(dt.getUTCMonth() + 1),
            d = addZero(dt.getUTCDate()),
            h = addZero(dt.getUTCHours()),
            n = addZero(dt.getUTCMinutes()),
            s = addZero(dt.getUTCSeconds()),
            strDate = Ext.String.format('{0}-{1}-{2} {3}:{4}:{5}', y, m, d, h, n, s);
        return new Date(Date.parse(strDate.replace(/-/g, " ")));
    },

    // =================== metodos retornando traduções ================== //

    prompt: function (msg,confirmFn, value, scope) {
        Ext.widget('exwindow', {
            title: OpenHouse.Msg.get('msg.Confirmation', 'Confirmação!'),
            width: 500,
            layout: 'fit',
            buttonAlign: 'center',
            defaultFocus: 'promptText',
            buttons: [
                {
                    scope: scope,
                    text: 'Confirma',
                    handler: function(btn) {
                        var win = btn.up('window'),
                            frm = win.down('form'),
                            text = win.down('textfield').getValue();
                    
                        if(!frm.getForm().isValid()) {
                            OpenHouse.Wakeful.showError(OpenHouse.Msg.invalidFields());
                            return false;
                        }
                    
                        confirmFn(text);
                        win.close();
                    }
                }, {
                    text: 'Cancela',
                    handler: function(btn){
                        btn.up('window').close();
                    }
                }
            ],
            items: [
                {
                    xtype: 'form',
                    padding: 10,
                    layout: 'anchor',
                    items: [
                        {
                            fieldLabel: msg,
                            xtype: 'textfield',
                            value: value,
                            anchor: '100%',
                            itemId: 'promptText'
                        }
                    ]
                }
            ]
        }).show();
    },

    question: function (msg,confirmFn) {
        Ext.Msg.show({
            title: this.get('msg.Confirmation', 'Confirmação!'),
            msg: msg,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: confirmFn
        });
    },

    attention: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Attention', 'Atenção!'),
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    },

    warning: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Warning', 'Aviso!'),
            msg: msg,
            buttons: Ext.Msg.CANCEL,
            icon: Ext.Msg.WARNING
        });
    },

    error: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Error', 'Erro!'),
            msg: msg,
            buttons: Ext.Msg.CANCEL,
            icon: Ext.Msg.ERROR
        });
    },

    info: function (msg) {
        Ext.Msg.show({
            title: this.get('msg.Information', 'Informação!'),
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO
        });
    },

    submitFailure: function (form, response) {
        var errorMsg, action = Ext.form.Action;

        switch (response.failureType) {
            case action.CLIENT_INVALID:
                errorMsg = this.invalidFieldsSubmitted();
                break;
            case action.CONNECT_FAILURE:
                errorMsg = this.ajaxFailure();
                break;
            case action.SERVER_INVALID:
                errorMsg = this.invalidServer();
                break;
            default: errorMsg = response.result.text;
        }

        this.dialogAttention(errorMsg, Ext.Msg.OK, Ext.Msg.ERROR);
    },

    invalidFields: function (args) {
        var msg = this.get('msg.InvalidFields', 'Existem que não foram corretamente preenchidos!');
        if (args) {
            this.dialogAttention(msg, args[0], args[1]);
            return true;
        } else {
            return msg;
        }
    },

    invalidServer: function () {
        return this.get('msg.InvalidServer', 'Servidor inválido!');
    },

    saving: function () {
        return this.get('msg.Saving', 'Salvando...!');
    },

    loading: function () {
        return this.get('msg.Loading', 'Carregando...!');
    },

    ajaxFailure: function () {
        return this.get('msg.AjaxFailure', 'A comunicação assincrona com o servidor falhou!');
    },

    loadingLibraries: function () {
        return this.get('msg.LoadingLibraries', 'Carregando classes...');
    },
            
    noRecordsToShow: function () {
        return this.get('msg.noRecordsToShow', 'Não há registros a serem exibidos...');
    },

    recordNoSelected: function () {
        return this.get('msg.RecordNoSelected', 'Não existe nenhum registro selecionado!');
    },

    modifyRecordSelected: function () {
        return this.get('msg.ModifyRecordSelected', 'Deseja realmente modificar esse registro?');
    },
    
    deleteRecordSelected: function () {
        return this.get('msg.DeleteRecordSelected', 'Deseja realmente remover esse registro?');
    },

    pleaseWait: function () {
        return this.get('msg.PleaseWait', 'Por favor aguarde');
    },
    
    pleaseInformDescription: function () {
        return this.get('msg.PleaseInformDescription', 'Por favor, informe a descrição!');
    },

    reRegistration: function () {
        return this.get('msg.Re-Registration', 'Você está tentando duplicar um registro que já foi lançado!');
    },

    invalidFieldsSubmitted: function () {
        return this.get('msg.InvalidValues', 'O formulário não pode ser enviado com campos inválidos!');
    },

    pagesLimitExceeded: function () {
        return this.get('msg.PagesLimitExceeded', 'Limite máximo de páginas excedido. Para abrir uma nova feche outra antes!');
    },

    fieldObservation: function () {
        return this.get('msg.fieldObservation', 'É importante o preenchimento da observação para esclarecimentos posteriores!');
    }

});