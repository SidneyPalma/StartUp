<?php

namespace AppAnest\Cache;

use AppAnest\Model\contractorunitreplacement as Model;

class contractorunitreplacement extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $schedulingperiodid = $data['schedulingperiodid'];
        $contractorsubunitid = $data['contractorsubunitid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
			select
                cur.id,
                cur.contractorsubunitid,
                cur.schedulingperiodid,
                cur.naturalpersonidof,
                personof.shortname as personof,
                cur.naturalpersonidto,
                personto.shortname as personto,
                cur.shift,
                getEnum('shift',cur.shift) as shiftdescription,
                cur.sun,
                cur.mon,
                cur.tue,
                cur.wed,
                cur.thu,
                cur.fri,
                cur.sat
            from
                contractorunitreplacement cur
                inner join person personof on ( personof.id = cur.naturalpersonidof )
                inner join person personto on ( personto.id = cur.naturalpersonidto )
            where cur.schedulingperiodid = :schedulingperiodid
              and cur.contractorsubunitid = :contractorsubunitid
            group by
                cur.id";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
            $pdo->bindValue(":contractorsubunitid", $contractorsubunitid, \PDO::PARAM_INT);

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