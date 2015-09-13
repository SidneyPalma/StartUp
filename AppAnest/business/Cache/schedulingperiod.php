<?php

namespace AppAnest\Cache;

use AppAnest\Model\schedulingperiod as Model;

class schedulingperiod extends \Smart\Data\Cache {

    public function selectLike(array $data) {
        $start = $data['start'];
        $limit = $data['limit'];
        $status = $data['status'];
        $params = $data['params'];
        $proxy = $this->getStore()->getProxy();

        $params = ( $params == 'all' ) ? "or sp.status != :status" : "";

        $sql = "
            select
                sp.id,
                sp.year,
                sp.month,
                sp.periodof,
                sp.periodto,
                sp.status
            from
                schedulingperiod sp
            where sp.status = :status
              $params
            order by sp.year desc, sp.month desc";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":status", $status, \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);
            self::_setPage($start,$limit);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}