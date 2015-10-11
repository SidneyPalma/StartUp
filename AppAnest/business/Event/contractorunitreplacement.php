<?php

namespace AppAnest\Event;

class contractorunitreplacement extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\contractorunitreplacement $model
     */
    public function preInsert( \AppAnest\Model\contractorunitreplacement &$model ) {

        $model->setSun( strlen($model->getSun()) == 0 ? 0 : $model->getSun() );
        $model->setMon( strlen($model->getMon()) == 0 ? 0 : $model->getMon() );
        $model->setTue( strlen($model->getTue()) == 0 ? 0 : $model->getTue() );
        $model->setWed( strlen($model->getWed()) == 0 ? 0 : $model->getWed() );
        $model->setThu( strlen($model->getThu()) == 0 ? 0 : $model->getThu() );
        $model->setFri( strlen($model->getFri()) == 0 ? 0 : $model->getFri() );
        $model->setSat( strlen($model->getSat()) == 0 ? 0 : $model->getSat() );

        $model->getSubmit()->setRow($model->getRecord());
    }

    /**
     * @param \AppAnest\Model\contractorunitreplacement $model
     */
    public function posInsert( \AppAnest\Model\contractorunitreplacement &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunitreplacement $model
     */
    public function preUpdate( \AppAnest\Model\contractorunitreplacement &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunitreplacement $model
     */
    public function posUpdate( \AppAnest\Model\contractorunitreplacement &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunitreplacement $model
     */
    public function preDelete( \AppAnest\Model\contractorunitreplacement &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorunitreplacement $model
     */
    public function posDelete( \AppAnest\Model\contractorunitreplacement &$model ) {

    }

}