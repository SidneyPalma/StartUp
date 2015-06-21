<?php

namespace AppAnest\Event;

class legalentity extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\legalentity $model
     */
    public function preInsert( \AppAnest\Model\legalentity &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->getStore()->getModel()->setTypeperson('L');
        $person->getStore()->getModel()->getSubmit()->setRowValue('typeperson','L');
        $person->update();
        $id = $person->getStore()->getModel()->getId();

        $model->setId($id);
        $model->getSubmit()->setRowValue('id',$id);
    }

    /**
     * @param \AppAnest\Model\legalentity $model
     */
    public function posInsert( \AppAnest\Model\legalentity &$model ) {

    }

    /**
     * @param \AppAnest\Model\legalentity $model
     */
    public function preUpdate( \AppAnest\Model\legalentity &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->update();
    }

    /**
     * @param \AppAnest\Model\legalentity $model
     */
    public function posUpdate( \AppAnest\Model\legalentity &$model ) {

    }

    /**
     * @param \AppAnest\Model\legalentity $model
     */
    public function preDelete( \AppAnest\Model\legalentity &$model ) {

    }

    /**
     * @param \AppAnest\Model\legalentity $model
     */
    public function posDelete( \AppAnest\Model\legalentity &$model ) {

    }

}