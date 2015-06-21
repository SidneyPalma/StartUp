<?php

namespace AppAnest\Cache;

use AppAnest\Model\personbank as Model;

class personbank extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            SELECT
                pb.*,
                getEnum('bank', pb.bank) as bankdescription,
                getEnum('accounttype', pb.accounttype) as accounttypedescription
            FROM
                personbank pb
            WHERE pb.personid = :personid";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":personid", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}