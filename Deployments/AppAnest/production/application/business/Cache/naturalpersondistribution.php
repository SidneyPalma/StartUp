<?php

namespace AppAnest\Cache;

use AppAnest\Model\naturalpersondistribution as Model;

class naturalpersondistribution extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sqlShift = "
            select
                etl.code as shift,
                etl.description as shiftdescription
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = 'shift';";

        $sqlWeekDay = "
            select
                etl.code as weekday
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = 'weekday'";

        $sqlDistribution = "
            select
                npd.id,
                :naturalpersonid as naturalpersonid,
                npd.contractorunitid,
                npd.shift,
                npd.weekday
            from
                naturalpersondistribution npd
            where npd.naturalpersonid = :naturalpersonid";

        try {
            $pdo = $proxy->prepare($sqlDistribution);

            $pdo->bindValue(":naturalpersonid", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $distributionRows = $pdo->fetchAll();
            $shiftRows = $proxy->query($sqlShift)->fetchAll();
            $weekdayRows = $proxy->query($sqlWeekDay)->fetchAll();

            $rows = array();

            $index = 0;

            // Turno do dia
            foreach ($shiftRows as $recShift) {

                $shift = $recShift["shift"];
                $shiftdescription = $recShift["shiftdescription"];

                $rows[$index]['id'] = $index +1;
                $rows[$index]["shift"] = $shift;
                $rows[$index]["shiftdescription"] = $shiftdescription;

                // Dia da semana
                foreach ($weekdayRows as $recWeekday) {
                    $weekday = $recWeekday["weekday"];
                    $rows[$index][$weekday] = null;
                    $rows[$index]["$weekday".'id'] = null;

                    // Valor do Dia
                    foreach ($distributionRows as $recDistribution) {
                        $id = $recDistribution["id"];
                        $naturalpersonid = $recDistribution["naturalpersonid"];
                        $contractorunitid = $recDistribution["contractorunitid"];

                        $rows[$index]["naturalpersonid"] = $naturalpersonid;

                        if($shift == $recDistribution["shift"] && $weekday == $recDistribution["weekday"]) {
                            $rows[$index]["$weekday".'id'] = $id;
                            $rows[$index][$weekday] = $contractorunitid;
                        }
                    }
                }
                $index++;
            }

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}