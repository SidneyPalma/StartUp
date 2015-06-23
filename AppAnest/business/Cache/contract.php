<?php

namespace AppAnest\Cache;

use AppAnest\Model\contract as Model;

class contract extends \Smart\Data\Cache {

    public function selectLike(array $data) {
        $query = $data['query'];
        $start = $data['start'];
        $limit = $data['limit'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                c.*,
                a.periodto,
                a.description,
                getAdditiveList(c.id) as additivelist,
                le.shortname as legalentity,
                pc.shortname as contractor,
                ct.cnpjnumber
            from
                contract c
                inner join person le on ( le.id = c.legalentityid )
                inner join person pc on ( pc.id = c.contractorid )
                inner join contractor ct on ( ct.id = pc.id )
                inner join additive a on ( a.contractid = c.id )
            where le.shortname like :query
               OR pc.shortname like :query
               OR c.contractnumber like :query";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":query", "$query%", \PDO::PARAM_STR);

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