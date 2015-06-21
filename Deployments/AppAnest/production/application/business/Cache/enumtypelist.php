<?php

namespace AppAnest\Cache;

use AppAnest\Model\enumtypelist as Model;

class enumtypelist extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $start = $data['start'];
        $limit = $data['limit'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            SELECT
                etl.*
            FROM
                enumtypelist etl
            WHERE etl.enumtypeid = :enumtypeid";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":enumtypeid", "$query", \PDO::PARAM_INT);

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