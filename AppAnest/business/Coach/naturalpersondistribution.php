<?php

namespace AppAnest\Coach;

class naturalpersondistribution extends \AppAnest\Setup\Setup {

    /**
     * @var \AppAnest\Model\naturalpersondistribution $model
     */
    public $model = '\AppAnest\Model\naturalpersondistribution';

    public function update() {
        $store = $this->getStore();
        $submit = $store->getModel()->getSubmit();

//        $id = $submit->getRowValue('id');
//
//        $update = isset($id) ? strlen($id) !== 0 : false;

//        if( $update == true ) {
//            $results = $store->update();
//        } else {
//            $results = $store->insert();
//        }

        return self::getResultToJson();

//        return $results;
    }

}