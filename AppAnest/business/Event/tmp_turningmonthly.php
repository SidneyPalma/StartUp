<?php

namespace AppAnest\Event;

use Smart\Utils\Session;

class tmp_turningmonthly extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\tmp_turningmonthly $model
     */
    public function preInsert( \AppAnest\Model\tmp_turningmonthly &$model ) {

    }

    /**
     * @param \AppAnest\Model\tmp_turningmonthly $model
     */
    public function posInsert( \AppAnest\Model\tmp_turningmonthly &$model ) {

    }

    /**
     * @param \AppAnest\Model\tmp_turningmonthly $model
     */
    public function preUpdate( \AppAnest\Model\tmp_turningmonthly &$model ) {
        date_default_timezone_set("America/Manaus");

        $id = $model->getId();
        $date = date("d/m/Y H:i");
        $username = Session::read('username');

        $rows = $this->getProxy()->query("select observation from tmp_turningmonthly where id = $id")->fetchAll();

        $observationOld = $rows[0]['observation'];
        $observationNew = $model->getObservation();

        $observation = "$observationNew <br/> $date - $username <br/> <br/> $observationOld";

        $model->setReleasetype('M');
        $model->setObservation($observation);
    }

    /**
     * @param \AppAnest\Model\tmp_turningmonthly $model
     */
    public function posUpdate( \AppAnest\Model\tmp_turningmonthly &$model ) {

    }

    /**
     * @param \AppAnest\Model\tmp_turningmonthly $model
     */
    public function preDelete( \AppAnest\Model\tmp_turningmonthly &$model ) {

    }

    /**
     * @param \AppAnest\Model\tmp_turningmonthly $model
     */
    public function posDelete( \AppAnest\Model\tmp_turningmonthly &$model ) {

    }

}