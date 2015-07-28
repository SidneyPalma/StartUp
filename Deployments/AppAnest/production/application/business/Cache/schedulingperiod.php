<?php

namespace AppAnest\Cache;

use AppAnest\Model\schedulingperiod as Model;

class schedulingperiod extends \Smart\Data\Cache {

    public function selectLike(array $data) {
        $query = $data['query'];
        $start = $data['start'];
        $limit = $data['limit'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                sp.*,
                p.year,
                p.month
            from
                schedulingperiod sp
                inner join period p on ( p.id = sp.periodid )";

        try {
            //$pdo = $proxy->prepare($sql);

            //$pdo->bindValue(":shift", "$query%", \PDO::PARAM_STR);

            //$pdo->execute();
            //$rows = $pdo->fetchAll();

            $rows = $proxy->query($sql)->fetchAll();

            self::_setRows($rows);
            self::_setPage($start,$limit);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}