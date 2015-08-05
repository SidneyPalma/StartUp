<?php

namespace AppAnest\Heart;

use AppAnest\Setup\Start;

class schema extends \Smart\Data\Proxy {

    private $schemamonthly = array(); // giroVertical
    private $schemaweekday = array(); // giroHorizontal

    public function __construct() {
        $dtb = Start::getDataBase();
        $usr = Start::getUserName();
        $pwd = Start::getPassWord();
        $this->post = (object)$_POST;

        $link = array($dtb, $usr, $pwd);

        parent::__construct( $link );
    }

    // Start
    public function selectTurningSchema () {
        $this->setAllocationSchema();

        return self::getResultToJson();
    }

    public function setAllocationSchema () {
        $periodid = $this->post->periodid;

        $sqlMonthly = "
          select
            id,
            schemaweek
          from
            allocationschema
          where periodid = :periodid";

        $sqlWeekDay = "
            select
                asm.id,
                asm.schemamap,
                etl.code as weekday,
                asm.weekold,
                asm.weeknew,
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

        $pdo = $this->prepare($sqlMonthly);

        $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);

        $pdo->execute();
        $row = self::encodeUTF8($pdo->fetchAll());

        $allocationschemaid = intval($row[0]['id']);
        $this->schemamonthly = json_decode($row[0]['schemaweek']);

        $pdo = $this->prepare($sqlWeekDay);

        $pdo->bindValue(":allocationschemaid", $allocationschemaid, \PDO::PARAM_INT);

        $pdo->execute();
        $row = self::encodeUTF8($pdo->fetchAll());

        $this->schemaweekday = json_decode($row[0]['schemamap']);

    }

    public function setTurningVertical () {

    }

    public function setTurningVerticalByLastWeek () {

    }

    public function setTurningVerticalDaysOfWeek () {

    }

    public function callAction() {
        $action = $this->post->action;
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }

}