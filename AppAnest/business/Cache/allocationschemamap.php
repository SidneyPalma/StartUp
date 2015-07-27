<?php

namespace AppAnest\Cache;

use AppAnest\Model\allocationschemamap as Model;

class allocationschemamap extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $allocationschemaid = $data['allocationschemaid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                asm.id,
                asm.schemamap,
                etl.code as weekday,
                :allocationschemaid as allocationschemaid,
                etl.description as weekdaydescription
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
                left join allocationschemamap asm on (
                    asm.weekday = etl.code
                    and asm.allocationschemaid = :allocationschemaid
                )
            where et.name = 'weekday'
            order by etl.orderby";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":allocationschemaid", $allocationschemaid, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectWeekDay(array $data) {
        $id = $data['id'];
        $weekday = $data["weekday"];
        $i_cutecost = $data["positioncute"];
        $crsContractorUnit = array();
        $tmpTurningMonthly = array();
        $turningHorizontal = array();

        $proxy = $this->getStore()->getProxy();

        // Obter novo
        $sqlSchemaWeek = "select schemaweek from allocationschema where id = :id";

        $pdo = $proxy->prepare($sqlSchemaWeek);

        $pdo->bindValue(":id", $id, \PDO::PARAM_INT);

        $pdo->execute();
        $json = self::encodeUTF8($pdo->fetchAll());

        $rows = self::jsonToArray($json[0]["schemaweek"]);

        $position = 0;
        $rownumber = 0;
        $contractorunitid = '';

        // Construindo a Lista de Unidades
        foreach ($rows as $record) {
            if ($record[$weekday] == "002") {
                if($contractorunitid !== $record["contractorunitid"]) $position++;
                $crsContractorUnit[$rownumber]["position"] = $position;
                $crsContractorUnit[$rownumber]["contractorunit"] = $record["contractorunit"];
                $crsContractorUnit[$rownumber]["contractorunitid"] = $record["contractorunitid"];
                $rownumber++;
                $contractorunitid = $record["contractorunitid"];
            }
        }

        $finded = false;

        // realinhar posição de corte
        $rownumber = 1;
        foreach ($crsContractorUnit as $record) {
            if ( (intval($record["position"]) == intval($i_cutecost)) && ($finded == false) ) {
                $finded = true;
                $i_cutecost = $rownumber;
            }
            $rownumber++;
        }

        $week = 1;

        $i_position = 1;
        $loopnumber = 1;
        $weeknumber = count($crsContractorUnit);

        // para cada Coluna = $week
        while ($week <= $weeknumber) {

            // obtem as unidades
            foreach ($crsContractorUnit as $record) {
                $position = intval($record["position"]);
                $contractorunit = $record["contractorunit"];
                $contractorunitid = intval($record["contractorunitid"]);

                $tmpTurningMonthly[$loopnumber]["position"] = str_pad($position,2,"0",STR_PAD_LEFT);
                $tmpTurningMonthly[$loopnumber]["positioncute"] = $i_cutecost;
                $tmpTurningMonthly[$loopnumber]["contractorunit"] = $contractorunit;
                $tmpTurningMonthly[$loopnumber]["contractorunitid"] = $contractorunitid;
                $tmpTurningMonthly[$loopnumber]["week" . str_pad($week,2,"0",STR_PAD_LEFT)] = $i_position;

                $loopnumber++;
                $i_position++;

                if($i_position > $weeknumber)  {
                    $i_position = 1;
                }
            }

            $week++;

            if ($week != 1) {
                $i_position = $tmpTurningMonthly[intval($i_cutecost)]["week" . str_pad($week-1,2,"0",STR_PAD_LEFT)];
            }

            $loopnumber = 1;
        }

        $id = 1;
        foreach ($tmpTurningMonthly as $record=>$fields) {
            $fields['id'] = $id;
            $turningHorizontal[] = $fields;
            $id++;
        }

        unset($crsContractorUnit);
        unset($tmpTurningMonthly);

        self::_setRows($turningHorizontal);

        return self::getResultToJson();
    }

}