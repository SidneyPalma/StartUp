<?php

namespace AppAnest\Event;

class personbank extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\personbank $model
     */
    public function preInsert( \AppAnest\Model\personbank &$model ) {
        $this->setOldIsDefault($model);
    }

    /**
     * @param \AppAnest\Model\personbank $model
     */
    public function posInsert( \AppAnest\Model\personbank &$model ) {

    }

    /**
     * @param \AppAnest\Model\personbank $model
     */
    public function preUpdate( \AppAnest\Model\personbank &$model ) {
        $this->setNewIsDefault($model);
    }

    public function setOldIsDefault($model) {
        $personid = $model->getPersonid();

        if($model->getIsdefault() == true) {
            $this->getProxy()->exec("update personbank set isdefault = false where personid = $personid");
        }
    }

    public function setNewIsDefault($model) {
        $id = $model->getId();
        $personid = $model->getPersonid();

        if($model->getIsdefault() == true) {
            $this->getProxy()->exec("update personbank set isdefault = false where id != $id and personid = $personid");
        }
    }

    /**
     * @param \AppAnest\Model\personbank $model
     */
    public function posUpdate( \AppAnest\Model\personbank &$model ) {

    }

    /**
     * @param \AppAnest\Model\personbank $model
     */
    public function preDelete( \AppAnest\Model\personbank &$model ) {

    }

    /**
     * @param \AppAnest\Model\personbank $model
     */
    public function posDelete( \AppAnest\Model\personbank &$model ) {

    }

}