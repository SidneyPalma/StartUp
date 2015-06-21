<?php

namespace Smart\Data;

use Smart\Utils\Submit;

/**
 * Um Model para a representação da tabela no Banco
 *
 * Class Model
 * @package Smart\Data
 */
class Model {

    /**
     * Requisição feita pelo cliente
     *
     * @var null|Submit
     */
    private $_submit = null;

    /**
     * Notações da classe Model
     *
     * @var null|stdClass
     */
    private $_notate = null;

    public function get ($field) {
        return $this->$field;
    }

    public function set ($field,$value) {
        $this->$field = $value;
        return $this;
    }

    public function getSubmit() {
        return $this->_submit;
    }

    public function getNotate() {
        return $this->_notate;
    }

    public function setSubmit( Submit $submit ) {
        $this->_submit = $submit;
    }

    public function setNotate( \stdClass $notate ) {
        $this->_notate = $notate;
    }

}