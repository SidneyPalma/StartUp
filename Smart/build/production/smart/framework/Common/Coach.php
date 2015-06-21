<?php

namespace Smart\Common;

use Smart\Data\Store;
use Smart\Data\Model;
use Smart\Common\Traits as Traits;

/**
 * Ancestral para as classes do tipo Coach
 *
 * @methods: getStore, getProxy, selectCode, selectLike, selectSame, selectDown, selectLoad
 * @category Coach
 *
 */
class Coach {
    use Traits\TresultSet,
        Traits\TvalidField;

    public $usr = "";
    public $pwd = "";
    public $dns = "";

    public $timezone = "America/Sao_Paulo";

    /**
     * @var string
     */
    public $model = null;

    /**
     * @var Store $store
     */
    private $store = null;

    public function __construct() {
        date_default_timezone_set($this->timezone);

        $link = array($this->dns, $this->usr, $this->pwd);

        $this->store = new Store($link, $this->model);
    }

    public function getStore () {
        return $this->store;
    }

    public function select() {
        $cache = $this->store->getCache();
        $model = $this->store->getModel();

        $submit = $model->getSubmit();
        $method = $submit->getRawValue('method');

        $data = $submit->getToArray();

        $results = $cache->$method($data);

        return $results;
    }

    public function update() {
        $submit = $this->store->getModel()->getSubmit();

        $id = $submit->getRowValue('id');

        $update = isset($id) ? strlen($id) !== 0 : false;

        if( $update == true ) {
            $results = $this->store->update();
        } else {
            $results = $this->store->insert();
        }

        return $results;
    }

    public function delete() {
        $results = $this->store->delete();
        return $results;
    }

    public function modify() {
        $cache = $this->store->getCache();
        $model = $this->store->getModel();

        $submit = $model->getSubmit();
        $method = $submit->getRawValue('method');

        $data = $submit->getToArray();

        $results = $cache->$method($data);

        return $results;
    }

    /**
     * Chama o método armazenado no indice <code>action<code/>
     *
     * @return json <code>$result<code/>
     */
    public function callAction() {
        $action = $this->store->getModel()->getSubmit()->getRawValue('action');
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }

}