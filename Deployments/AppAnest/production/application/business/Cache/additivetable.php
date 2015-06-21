<?php

namespace AppAnest\Cache;

use AppAnest\Model\additivetable as Model;

class additivetable extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $additiveid = $data['additiveid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                a.id,
                :additiveid as additiveid,
                e.code as shifttype,
                getEnum(t.name,e.code) as shifttypedescription,
                coalesce(a.shiftamount,0.00) as shiftamount,
                coalesce(a.shiftvalue,0.00) as shiftvalue,
                case coalesce(a.id,0) when 0 then 0 else 1 end as isactive
            from
                enumtypelist e
                inner join enumtype t on ( t.id = e.enumtypeid )
                left join additivetable a on ( a.shifttype = e.code and a.additiveid = :additiveid )
            where t.name = 'shifttype'";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":additiveid", $additiveid, \PDO::PARAM_INT);

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