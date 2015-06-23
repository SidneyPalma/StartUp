<?php

namespace AppAnest\Cache;

use AppAnest\Model\additive as Model;

class additive extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $contractid = $data['contractid'];
        $additivenumber = $data['additivenumber'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                a.*,
                c.contractnumber,
                c.legalentityid,
                c.contractorid,
                c.contractdate,
                c.isactive,
                le.shortname as legalentity,
                pc.shortname as contractor,
                getEnum('additivestatus',a.additivestatus) as additivestatusdescription
            from
                additive a
                inner join contract c on ( a.contractid = c.id )
                inner join person le on ( le.id = c.legalentityid )
                inner join person pc on ( pc.id = c.contractorid )
            where a.contractid = :contractid
              and a.additivenumber = :additivenumber";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":contractid", $contractid, \PDO::PARAM_INT);
            $pdo->bindValue(":additivenumber", $additivenumber, \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectNew(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                c.*,
                le.shortname as legalentity,
                pc.shortname as contractor
            from
                contract c
                inner join person le on ( le.id = c.legalentityid )
                inner join person pc on ( pc.id = c.contractorid )
            where c.id = :query";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":query", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectLog(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                a.id,
                a.contractid,
                a.additivestatus,
                getEnum('additivestatus', a.additivestatus) as additivestatusdescription,
                a.additivenumber,
                c.contractnumber
            from
                additive a
                inner join contract c on ( a.contractid = c.id )
            where a.contractid = :query";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":query", $query, \PDO::PARAM_INT);

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