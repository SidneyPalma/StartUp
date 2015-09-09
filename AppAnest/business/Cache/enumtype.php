<?php

namespace AppAnest\Cache;

use AppAnest\Model\enumtype as Model;

class enumtype extends \Smart\Data\Cache {

    public function selectEnum(array $data) {
        $type = $data['type'];
        $query = $data['query'];
        $description = $type . 'description';
        $proxy = $this->getStore()->getProxy();
        $sql = "
            select
                etl.code as $type,
                etl.description as $description
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = :name
              and etl.description LIKE :description
            order by etl.orderby, etl.description";


        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":name", $type, \PDO::PARAM_STR);
            $pdo->bindValue(":description", "$query%", \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectMobileDigit(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "select coalesce(getEnum('mobiledigit', :query),'9999-9999') as mobiledigit";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":query", $query, \PDO::PARAM_STR);

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