<?php

namespace AppAnest\Cache;

use AppAnest\Model\tmp_turningmonthly as Model;

class tmp_turningmonthly extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            SELECT
                tmp.*,
                p.shortname,
                getEnum('shift', tmp.shift) as shiftdescription,
                getEnum('subunit', tmp.subunit) as subunitdescription,
                getEnum('releasetype', tmp.releasetype) as releasetypedescription,
                getEnum('allocationschema', tmp.allocationschema) as allocationschemadescription
            FROM
                tmp_turningmonthly tmp
                inner join person p on ( p.id = tmp.naturalpersonid )
            WHERE tmp.id = :id";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":id", $query, \PDO::PARAM_INT);

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