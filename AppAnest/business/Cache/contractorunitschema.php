<?php

namespace AppAnest\Cache;

use AppAnest\Model\contractorunitschema as Model;

class contractorunitschema extends \Smart\Data\Cache {


    public function selectLike(array $data) {
        $query = $data['query'];
        $start = $data['start'];
        $limit = $data['limit'];
        $schedulingperiodid = $data['schedulingperiodid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                csu.id,
                p.shortname,
                csu.contractorunitid,
                :schedulingperiodid as schedulingperiodid,
                csu.id as contractorsubunitid,
                etl.description as subunitdescription
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
                inner join contractorsubunit csu on ( csu.subunit = etl.code )
                inner join contractorunit cu on ( cu.id = csu.contractorunitid )
                inner join person p on ( p.id = cu.id )
            where et.name = 'subunit'
              and p.shortname like :shortname
            order by
                p.shortname,
                etl.description";

        try {
            $pdo = $proxy->prepare($sql);

            $query = '%' . $query . '%';

            $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
            $pdo->bindValue(":shortname", $query, \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        self::_setPage($start, $limit);
        return self::getResultToJson();
    }

    public function selectCode(array $data) {
        $allocationtype = $data['allocationtype'];
        $contractorunitid = $data['contractorunitid'];
        $schedulingperiodid = $data['schedulingperiodid'];
        $contractorsubunitid = $data['contractorsubunitid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
			select
                cus.schedulingperiodid,
                csu.contractorunitid,
                cus.position,
                csu.subunit,
                cus.shift,
                getEnum('shift',cus.shift) as shiftdescription,
                max(case when cus.weekday = 'mon' then cus.id end) mon,
                max(case when cus.weekday = 'mon' then ( select shortname from person where id = cus.naturalpersonid ) end) monperson,
                max(case when cus.weekday = 'tue' then cus.id end) tue,
                max(case when cus.weekday = 'tue' then ( select shortname from person where id = cus.naturalpersonid ) end) tueperson,
                max(case when cus.weekday = 'wed' then cus.id end) wed,
                max(case when cus.weekday = 'wed' then ( select shortname from person where id = cus.naturalpersonid ) end) wedperson,
                max(case when cus.weekday = 'thu' then cus.id end) thu,
                max(case when cus.weekday = 'thu' then ( select shortname from person where id = cus.naturalpersonid ) end) thuperson,
                max(case when cus.weekday = 'fri' then cus.id end) fri,
                max(case when cus.weekday = 'fri' then ( select shortname from person where id = cus.naturalpersonid ) end) friperson,
                max(case when cus.weekday = 'sat' then cus.id end) sat,
                max(case when cus.weekday = 'sat' then ( select shortname from person where id = cus.naturalpersonid ) end) satperson,
                max(case when cus.weekday = 'sun' then cus.id end) sun,
                max(case when cus.weekday = 'sun' then ( select shortname from person where id = cus.naturalpersonid ) end) sunperson
            from
                contractorunitschema cus
                inner join contractorsubunit csu on ( csu.id = cus.contractorsubunitid )
            where cus.allocationtype = :allocationtype
              and csu.contractorunitid = :contractorunitid
			  and cus.schedulingperiodid = :schedulingperiodid
              and cus.contractorsubunitid = :contractorsubunitid
            group by
                cus.schedulingperiodid,
                cus.shift,
                csu.subunit,
                cus.position";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":allocationtype", $allocationtype, \PDO::PARAM_STR);
            $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
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