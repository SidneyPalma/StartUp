<?php

namespace AppAnest\Event;

class contractor extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\contractor $model
     */
    public function preInsert( \AppAnest\Model\contractor &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->getStore()->getModel()->setTypeperson('C');
        $person->getStore()->getModel()->getSubmit()->setRowValue('typeperson','C');
        $person->update();
        $id = $person->getStore()->getModel()->getId();

        $model->setId($id);
        $model->getSubmit()->setRowValue('id',$id);
    }

    /**
     * @param \AppAnest\Model\contractor $model
     */
    public function posInsert( \AppAnest\Model\contractor &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractor $model
     */
    public function preUpdate( \AppAnest\Model\contractor &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->update();
    }

    /**
     * @param \AppAnest\Model\contractor $model
     */
    public function posUpdate( \AppAnest\Model\contractor &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractor $model
     */
    public function preDelete( \AppAnest\Model\contractor &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractor $model
     */
    public function posDelete( \AppAnest\Model\contractor &$model ) {

    }

}