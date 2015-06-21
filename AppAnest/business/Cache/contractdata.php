<?php

namespace AppAnest\Cache;

use AppAnest\Model\contractdata as Model;

class contractdata extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $contractid = $data['contractid'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                'contract' as tablename,
                -- c.id,
                concat(lpad(c.id,'4','0'),lpad(a.id,'4','0')) as id,
                c.fileinfo,
                null as observation,
                concat(substring(c.contractnumber, 1,3),'/',substring(c.contractnumber, 4,4)) as contractcode,
                a.additivenumber as additivecode
            from
                contract c
                inner join additive a on ( a.contractid = c.id and a.additivenumber = '000' )
            where c.id = :contractid

            union all

            select
                'additive' as tablename,
                -- a.id,
                concat(lpad(a.id,'4','0'),lpad(c.id,'4','0')) as id,
                a.fileinfo,
                null as observation,
                concat(substring(c.contractnumber, 1,3),'/',substring(c.contractnumber, 4,4)) as contractcode,
                a.additivenumber as additivecode
            from
                additive a
                inner join contract c on ( c.id = a.contractid and a.additivenumber != '000' )
            where a.contractid = :contractid

            union all

            select
                'contractdata' as tablename,
                -- d.id,
                concat(lpad(d.id,'4','0'),lpad(0,'4','0')) as id,
                d.fileinfo,
                d.observation,
                concat(substring(c.contractnumber, 1,3),'/',substring(c.contractnumber, 4,4)) as contractcode,
                d.description as additivecode
            from
                contract c
                inner join contractdata d on ( d.contractid = c.id )
            where c.id = :contractid";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":contractid", $contractid, \PDO::PARAM_INT);

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