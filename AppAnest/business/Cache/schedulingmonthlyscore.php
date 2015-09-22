<?php

namespace AppAnest\Cache;

use AppAnest\Model\schedulingmonthlyscore as Model;

class schedulingmonthlyscore extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $scoretype = $data['scoretype'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                smc.id,
                smc.schedulingmonthlypartnersid,
                smc.naturalpersonid,
                p.shortname as naturalperson,
                smc.scoretype,
                smc.changedate,
                smc.username,
                smc.observation,
                smc.dutyfraction
            from
                schedulingmonthlyscore smc
                inner join person p on ( p.id = smc.naturalpersonid )
            where smc.schedulingmonthlypartnersid = :id
              and smc.scoretype = :scoretype";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":id", $query, \PDO::PARAM_INT);
            $pdo->bindValue(":scoretype", $scoretype, \PDO::PARAM_STR);

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