<?php

namespace AppAnest\Event;

class personphone extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\personphone $model
     */
    public function preInsert( \AppAnest\Model\personphone &$model ) {
        $this->setOldIsDefault($model);
    }

    /**
     * @param \AppAnest\Model\personphone $model
     */
    public function posInsert( \AppAnest\Model\personphone &$model ) {

    }

    /**
     * @param \AppAnest\Model\personphone $model
     */
    public function preUpdate( \AppAnest\Model\personphone &$model ) {
        $this->setNewIsDefault($model);
    }

    public function setOldIsDefault($model) {
        $personid = $model->getPersonid();

        if($model->getIsdefault() == true) {
            $this->getProxy()->exec("update personphone set isdefault = false where personid = $personid");
        }
    }

    public function setNewIsDefault($model) {
        $id = $model->getId();
        $personid = $model->getPersonid();

        if($model->getIsdefault() == true) {
            $this->getProxy()->exec("update personphone set isdefault = false where id != $id and personid = $personid");
        }
    }

    /**
     * @param \AppAnest\Model\personphone $model
     */
    public function posUpdate( \AppAnest\Model\personphone &$model ) {

    }

    /**
     * @param \AppAnest\Model\personphone $model
     */
    public function preDelete( \AppAnest\Model\personphone &$model ) {

    }

    /**
     * @param \AppAnest\Model\personphone $model
     */
    public function posDelete( \AppAnest\Model\personphone &$model ) {

    }

}