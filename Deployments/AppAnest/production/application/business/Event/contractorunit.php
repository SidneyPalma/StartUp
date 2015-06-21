<?php

namespace AppAnest\Event;

class contractorunit extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\contractorunit $model
     */
    public function preInsert( \AppAnest\Model\contractorunit &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->getStore()->getModel()->setTypeperson('U');
        $person->getStore()->getModel()->getSubmit()->setRowValue('typeperson','U');
        $person->update();
        $id = $person->getStore()->getModel()->getId();

        $model->setId($id);
        $model->getSubmit()->setRowValue('id',$id);
    }

    /**
     * @param \AppAnest\Model\contractorunit $model
     */
    public function posInsert( \AppAnest\Model\contractorunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunit $model
     */
    public function preUpdate( \AppAnest\Model\contractorunit &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->update();
    }

    /**
     * @param \AppAnest\Model\contractorunit $model
     */
    public function posUpdate( \AppAnest\Model\contractorunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunit $model
     */
    public function preDelete( \AppAnest\Model\contractorunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunit $model
     */
    public function posDelete( \AppAnest\Model\contractorunit &$model ) {

    }

}