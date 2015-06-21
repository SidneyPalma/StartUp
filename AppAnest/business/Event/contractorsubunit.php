<?php

namespace AppAnest\Event;

class contractorsubunit extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\contractorsubunit $model
     */
    public function preInsert( \AppAnest\Model\contractorsubunit &$model ) {
        $this->validateReserved($model);
    }

    public function validateReserved( \AppAnest\Model\contractorsubunit &$model ) {
        $proxy = $this->getProxy();
        $subunit = $model->getSubunit();
        $reserved = $model->getReserved();

        $sql = "select count(csu.id) as count from contractorsubunit csu where csu.subunit = :subunit";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":subunit", $subunit, \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            $count = intval($rows[0]['count']);

            if( ($count != 0) && ($reserved) ) {
                throw new \PDOException('Esta SubUnidade não pode ser reservada pois já esta em uso!');
            }
        } catch ( \PDOException $e ) {
            throw new \PDOException($e->getMessage());
        }
    }

    /**
     * @param \AppAnest\Model\contractorsubunit $model
     */
    public function posInsert( \AppAnest\Model\contractorsubunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorsubunit $model
     */
    public function preUpdate( \AppAnest\Model\contractorsubunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorsubunit $model
     */
    public function posUpdate( \AppAnest\Model\contractorsubunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorsubunit $model
     */
    public function preDelete( \AppAnest\Model\contractorsubunit &$model ) {

    }

    /**
     * @param \AppAnest\Model\contractorsubunit $model
     */
    public function posDelete( \AppAnest\Model\contractorsubunit &$model ) {

    }

}