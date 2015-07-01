<?php

namespace AppAnest\Cache;

use AppAnest\Model\personphone as Model;

class personphone extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            SELECT
                pp.*,
                coalesce(getEnum('mobiledigit', pp.ddd),'9999-9999') as mobiledigit,
                getEnum('phoneoperator', pp.phoneoperator) as phoneoperatordescription,
                getEnum('phonetype', pp.phonetype) as phonetypedescription,
                getEnum('linetype', pp.linetype) as linetypedescription
            FROM
                personphone pp
            WHERE pp.personid = :personid";

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