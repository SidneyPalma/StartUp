<?php

namespace AppAnest\Turning;

class vertical extends \Smart\Data\Proxy {

    private $schemamonthly = array();

    public function setAllocationSchema () {
        $sqlSchemaMonthly = "select schemaweek from allocationschema where id = :allocationschemaid";
        $pdo = $this->prepare($sqlSchemaMonthly);
//        $pdo->bindValue(":allocationschemaid", $allocationschemaid, \PDO::PARAM_INT);
        $pdo->execute();
        $week = self::encodeUTF8($pdo->fetchAll());

        if(count($week) !== 0) {
            $schemaweek = $week[0]["schemaweek"];
            if (strlen($schemaweek) !== 0) {
                $this->schemamonthly = self::jsonToArray($schemaweek);
            }
        }
    }

    public function setTurningVertical () {

    }

    public function setTurningVerticalByLastWeek () {

    }

    public function setTurningVerticalDaysOfWeek () {

    }

}