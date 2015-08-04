<?php

namespace AppAnest\Cache;

use AppAnest\Model\contractorunitschema as Model;

class contractorunitschema extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                cus.contractorunitid,
                cus.shift,
                getEnum('shift',cus.shift) as shiftdescription,
                cus.position,
                max(case when cus.weekday = 'mon' then cus.id end) mon,
                max(case when cus.weekday = 'mon' then ( select shortname from person where id = cus.naturalpersonid ) end) monperson,
                max(case when cus.weekday = 'tue' then cus.id end) tue,
                max(case when cus.weekday = 'tue' then ( select shortname from person where id = cus.naturalpersonid ) end) tueperson,
                max(case when cus.weekday = 'wed' then cus.id end) wed,
                max(case when cus.weekday = 'wed' then ( select shortname from person where id = cus.naturalpersonid ) end) wedperson,
                max(case when cus.weekday = 'thu' then cus.id end) thu,
                max(case when cus.weekday = 'thu' then ( select shortname from person where id = cus.naturalpersonid ) end) thuperson,
                max(case when cus.weekday = 'fri' then cus.id end) fri,
                max(case when cus.weekday = 'fri' then ( select shortname from person where id = cus.naturalpersonid ) end) friperson
            from
                contractorunitschema cus
            where cus.contractorunitid = :contractorunitid
            group by
                cus.contractorunitid,
                cus.shift,
                cus.position";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":contractorunitid", $query, \PDO::PARAM_INT);

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