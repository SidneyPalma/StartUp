<?php

namespace AppAnest\Event;

use Smart\Utils\Session;

class schedulingmonthlypartners extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function preInsert( \AppAnest\Model\schedulingmonthlypartners &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function posInsert( \AppAnest\Model\schedulingmonthlypartners &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function preUpdate( \AppAnest\Model\schedulingmonthlypartners &$model ) {
        date_default_timezone_set("America/Manaus");

        $id = $model->getId();
        $date = date("d/m/Y H:i");
        $username = Session::read('username');

        $rows = $this->getProxy()->query("select observation from schedulingmonthlypartners where id = $id")->fetchAll();

        $observationOld = $rows[0]['observation'];
        $observationNew = $model->getObservation();

        $observation = "$observationNew <br/> $date - $username <br/> <br/> $observationOld";

        $model->setObservation($observation);
    }

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function posUpdate( \AppAnest\Model\schedulingmonthlypartners &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function preDelete( \AppAnest\Model\schedulingmonthlypartners &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function posDelete( \AppAnest\Model\schedulingmonthlypartners &$model ) {

    }

}