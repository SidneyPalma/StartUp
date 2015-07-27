<?php

namespace AppAnest\Cache;

use AppAnest\Model\period as Model;

class period extends \Smart\Data\Cache {

    public function selectLike(array $data) {
        $start = $data['start'];
        $limit = $data['limit'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                p.id,
                p.year,
                p.month,
                concat(lpad(p.year,4,'0'),'-',lpad(p.month,2,'0'),'-','01') as periodof,
                last_day(concat(lpad(p.year,4,'0'),'-',lpad(p.month,2,'0'),'-','01')) as periodto
            from
                period p
            order by p.year, p.month";

        try {
            $rows = $proxy->query($sql)->fetchAll();

            self::_setRows($rows);
            self::_setPage($start,$limit);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}