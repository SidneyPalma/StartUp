<?php

namespace AppAnest\Event;

class naturalperson extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\naturalperson $model
     */
    public function preInsert( \AppAnest\Model\naturalperson &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->getStore()->getModel()->setTypeperson('N');
        $person->getStore()->getModel()->getSubmit()->setRowValue('typeperson','N');
        $person->update();
        $id = $person->getStore()->getModel()->getId();

        $model->setId($id);
        $model->getSubmit()->setRowValue('id',$id);
    }

    /**
     * @param \AppAnest\Model\naturalperson $model
     */
    public function posInsert( \AppAnest\Model\naturalperson &$model ) {

    }

    /**
     * @param \AppAnest\Model\naturalperson $model
     */
    public function preUpdate( \AppAnest\Model\naturalperson &$model ) {
        $person = new \AppAnest\Coach\person();
        $person->update();
    }

    /**
     * @param \AppAnest\Model\naturalperson $model
     */
    public function posUpdate( \AppAnest\Model\naturalperson &$model ) {

    }

    /**
     * @param \AppAnest\Model\naturalperson $model
     */
    public function preDelete( \AppAnest\Model\naturalperson &$model ) {

    }

    /**
     * @param \AppAnest\Model\naturalperson $model
     */
    public function posDelete( \AppAnest\Model\naturalperson &$model ) {

    }

}