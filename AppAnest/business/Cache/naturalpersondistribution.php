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
                p.shortname as contractorunitdescription,
                npd.shift,
                npd.weekday
            from
                naturalpersondistribution npd
                left join person p on ( p.id = npd.contractorunitid )
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

            $shiftOn = '<div style="color: rgb(131, 187, 56); font-size: 16px; text-align: center;"><span style="cursor: pointer;"><i class="icon-ok-squared"></i></span></div>';
            $shiftOf = '<div style="color: rgb(210, 180, 140); font-size: 16px; text-align: center;"><span style="cursor: pointer;"><i class="icon-ok-squared"></i></span></div>';

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
                    $rows[$index]["$weekday".'id'] = null;
                    $rows[$index]["$weekday".'description'] = $shift == 'N' ? $shiftOf : null;

                    // Valor do Dia
                    foreach ($distributionRows as $recDistribution) {
                        $id = $recDistribution["id"];
                        $naturalpersonid = $recDistribution["naturalpersonid"];
                        $contractorunitid = $recDistribution["contractorunitid"];
                        $contractorunitdescription = $recDistribution["contractorunitdescription"];

                        $rows[$index]["naturalpersonid"] = $naturalpersonid;

                        if($shift == $recDistribution["shift"] && $weekday == $recDistribution["weekday"]) {
                            $rows[$index]["$weekday".'id'] = $id;
                            $rows[$index][$weekday] = $contractorunitid;
                            $rows[$index]["$weekday".'description'] = $contractorunitdescription;

                            if($shift == 'N') {
                                $rows[$index]["$weekday".'description'] = strlen($id) != 0 ? $shiftOn : $shiftOf;
                            }
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