<?php

namespace AppAnest\Event;

use Smart\Utils\Session;

class schedulingmonthlypartners extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\schedulingmonthlypartners $model
     */
    public function preInsert( \AppAnest\Model\schedulingmonthlypartners &$model ) {
        date_default_timezone_set("America/Manaus");
        $date = date("d/m/Y H:i");
        $proxy = $this->getProxy();
        $username = Session::read('username');
        $shift = $model->getSubmit()->getRowValue('shift');
        $subunit = $model->getSubmit()->getRowValue('subunit');
        $dutydate = $model->getSubmit()->getRowValue('dutydate');
        $contractorunitid = $model->getSubmit()->getRowValue('contractorunitid');

        $sqlIdentify = "
            select
                sm.id as schedulingmonthlyid
            from
                schedulingmonthly sm
            where sm.dutydate = :dutydate
              and sm.contractorunitid = :contractorunitid
              and sm.shift = :shift";

        $pdo = $proxy->prepare($sqlIdentify);
        $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
        $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
        $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
        $pdo->execute();

        $rows = $pdo->fetchAll();
        $schedulingmonthlyid = $rows[0]['schedulingmonthlyid'];

        $sqlPosition = "
            select
                max(tmp.position)+1 as position
            from
                schedulingmonthlypartners tmp
            where tmp.shift = :shift
              and tmp.subunit = :subunit
              and tmp.schedulingmonthlyid = :schedulingmonthlyid";

        $pdo = $proxy->prepare($sqlPosition);
        $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
        $pdo->bindValue(":subunit", $subunit, \PDO::PARAM_STR);
        $pdo->bindValue(":schedulingmonthlyid", $schedulingmonthlyid, \PDO::PARAM_INT);
        $pdo->execute();

        $rows = $pdo->fetchAll();

        $observation = $model->getObservation();
        $position = (strlen($rows[0]['position'])) != 0 ? $rows[0]['position'] : 1;

        $model->setShifthours(12);
        $model->setReleasetype('M');
        $model->setUsername($username);
        $model->setPosition($position);
        $model->setSchedulingmonthlyid($schedulingmonthlyid);
        $model->setObservation("$observation <br/> $date - $username");

        $model->getSubmit()->setRow($model->getRecord());
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