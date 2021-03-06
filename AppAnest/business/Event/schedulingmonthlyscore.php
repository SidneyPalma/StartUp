<?php

namespace AppAnest\Event;

use Smart\Utils\Session;

class schedulingmonthlyscore extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\schedulingmonthlyscore $model
     */
    public function preInsert( \AppAnest\Model\schedulingmonthlyscore &$model ) {
        date_default_timezone_set("America/Manaus");
        $date = date("Y-m-d H:i");
        $username = Session::read('username');

        $proxy = $this->getProxy();
        $scoretype = $model->getScoretype();
        $dutyfraction = floatval($model->getDutyfraction());
        $schedulingmonthlypartnersid = $model->getSchedulingmonthlypartnersid();

        $sql = "
            select
                sum(coalesce(dutyfraction,0)) as dutyfraction
            from
                schedulingmonthlyscore
            where schedulingmonthlypartnersid = :schedulingmonthlypartnersid
              and scoretype = :scoretype";

        if($scoretype == 'P') {
            $pdo = $proxy->prepare($sql);
            $pdo->bindValue(":schedulingmonthlypartnersid", $schedulingmonthlypartnersid, \PDO::PARAM_INT);
            $pdo->bindValue(":scoretype", $scoretype, \PDO::PARAM_STR);
            $pdo->execute();

            $rows = $pdo->fetchAll();
            $dutyfraction += floatval($rows[0]['dutyfraction']);

            if($dutyfraction > 1) {
//                throw new \PDOException('O valor total da fracao nao pode ser maior que 1!');
            }
        }

        $model->setChangedate($date);
        $model->setUsername($username);
        $model->getSubmit()->setRow($model->getRecord());
    }

    /**
     * @param \AppAnest\Model\schedulingmonthlyscore $model
     */
    public function posInsert( \AppAnest\Model\schedulingmonthlyscore &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlyscore $model
     */
    public function preUpdate( \AppAnest\Model\schedulingmonthlyscore &$model ) {
        $proxy = $this->getProxy();
        $id =$model->getId();
        $scoretype = $model->getScoretype();
        $dutyfraction = floatval($model->getDutyfraction());
        $naturalpersonid = intval($model->getNaturalpersonid());
        $schedulingmonthlypartnersid = $model->getSchedulingmonthlypartnersid();

        $sqlP = "
            select
                sum(coalesce(dutyfraction,0)) as dutyfraction
            from
                schedulingmonthlyscore
            where schedulingmonthlypartnersid = :schedulingmonthlypartnersid
              and scoretype = 'P'
              and id != :id";

        $sqlR = "
            set SQL_SAFE_UPDATES = 0;

            set @naturalpersonid = (
                        select
                            naturalpersonid
                        from
                            schedulingmonthlyscore
                        where id = :id
                          and scoretype = 'R'
                        limit 1
                );

            update
                schedulingmonthlyscore
                set naturalpersonid = :naturalpersonid
            where schedulingmonthlypartnersid = :schedulingmonthlypartnersid
              and scoretype = 'P'
              and naturalpersonid = @naturalpersonid;

            set SQL_SAFE_UPDATES = 1;";

        if($scoretype == 'R') {
            $pdo = $proxy->prepare($sqlR);
            $pdo->bindValue(":schedulingmonthlypartnersid", $schedulingmonthlypartnersid, \PDO::PARAM_INT);
            $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
            $pdo->bindValue(":id", $id, \PDO::PARAM_INT);
            $pdo->execute();
        }

        if($scoretype == 'P') {
            $pdo = $proxy->prepare($sqlP);
            $pdo->bindValue(":schedulingmonthlypartnersid", $schedulingmonthlypartnersid, \PDO::PARAM_INT);
            $pdo->bindValue(":id", $id, \PDO::PARAM_INT);
            $pdo->execute();

            $rows = $pdo->fetchAll();
            $dutyfraction += floatval($rows[0]['dutyfraction']);

            if($dutyfraction > 1) {
//                throw new \PDOException('O valor total da fracao nao pode ser maior que 1!');
            }
        }
    }

    /**
     * @param \AppAnest\Model\schedulingmonthlyscore $model
     */
    public function posUpdate( \AppAnest\Model\schedulingmonthlyscore &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlyscore $model
     */
    public function preDelete( \AppAnest\Model\schedulingmonthlyscore &$model ) {

    }

    /**
     * @param \AppAnest\Model\schedulingmonthlyscore $model
     */
    public function posDelete( \AppAnest\Model\schedulingmonthlyscore &$model ) {

    }

}