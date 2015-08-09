<?php

namespace AppAnest\Heart;

use Smart\Utils\Session;
use AppAnest\Setup\Start;

class schema extends \Smart\Data\Proxy {

    // Esquema Semanal
    private $schemamonthly = null;

    // Mapa Giro Noturno
    private $schemaweekday = null;

    // Ultima semana periodo anterior
    private $schemaweekold = null;

    public function __construct() {
        $this->post = (object)$_POST;

        $link = array(Start::getDataBase(), Start::getUserName(), Start::getPassWord());

        parent::__construct( $link );

        $this->setAllocationSchema();
    }

    // Start
    public function selectTurningSchema () {
        $this->setSchemaMonthly();
        return self::getResultToJson();
    }

    private function setSchemaMonthly () {
        $daysweek = array(2,3,4,5,6);
        $periodid = $this->post->periodid;

        // Limpando Conteúdo da Tabela Temporária, INSERIR SCHEMA
        $this->exec("
                  delete from tmp_turningmonthly where id > 0;
                  alter table tmp_turningmonthly AUTO_INCREMENT = 1;");

        $sqlDaysWeek = "
            select
                sp.id as schedulingperiodid,
                concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')) as dateofmonth,
                substring(lower(dayname(concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')))),1,3) as dayname
            from
                ( select
                    @row := @row + 1 as row
                  from
                    ( select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6 ) t1,
                    ( select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6 ) t2,
                    ( select @row:=-1 ) t3 limit 31
                ) b,
                schedulingperiod sp
            where sp.periodid = :periodid
              and date_add(sp.periodof, interval row day) between sp.periodof and sp.periodto
              and dayofweek(date_add(sp.periodof, interval row day)) = :dayofweek";

        foreach($daysweek as $dayofweek) {
            $pdo = $this->prepare($sqlDaysWeek);
            $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);
            $pdo->bindValue(":dayofweek", $dayofweek, \PDO::PARAM_INT);
            $pdo->execute();
            $dayList = $pdo->fetchAll();
            $this->setInsertSchema($dayList);
            $this->setUpdateSchema($dayList,$dayofweek);
        }
    }

    private function setInsertSchema(array $dayList) {
        $username = Session::read('username');
        $schemaweek = self::jsonToArray($this->schemamonthly[0]["schemaweek"]);

        $sqlInsertSchemaMonthly = "
                call setSchemaMonthlyInsert (
                    :schedulingperiodid,
                    :contractorunitid,
                    :allocationschema,
                    :dateofmonth,
                    :shift,
                    :subunit,
                    :position,
                    :username
                );";

        foreach($dayList as $a) {
            $dayname = $a['dayname'];
            $dateofmonth = $a['dateofmonth'];
            $schedulingperiodid = $a['schedulingperiodid'];
            foreach($schemaweek as $b) {
                $shift = $b['shift'];
                $subunit = $b['subunit'];
                $position = $b['position'];
                $allocationschema = $b[$dayname];
                $contractorunitid = $b['contractorunitid'];
                $pdo = $this->prepare($sqlInsertSchemaMonthly);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", $allocationschema, \PDO::PARAM_STR);
                $pdo->bindValue(":dateofmonth", $dateofmonth, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->bindValue(":username", $username, \PDO::PARAM_STR);
                $pdo->bindValue(":subunit", $subunit, \PDO::PARAM_STR);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->execute();
            }
        }
    }

    private function setUpdateSchema(array $dayList, $dayofweek) {
        $lastWeek = self::searchArray($this->schemaweekold,'dayofweek',$dayofweek);

        $sqlUpdateSchemaMonthly = "
                call setSchemaMonthlyUpdate (
                    :schedulingperiodid,
                    :naturalpersonid,
                    :contractorunitid,
                    '001',
                    :dateofmonth,
                    'D',
                    :position
                );";

        foreach($dayList as $m) {
            $dateofmonth = $m['dateofmonth'];
            $schedulingperiodid = $m['schedulingperiodid'];
            $dayWeek = $this->setTurningV($lastWeek);
            foreach($dayWeek as $d) {
                $position = $d['position'];
                $naturalpersonid = $d['naturalpersonid'];
                $contractorunitid = $d['contractorunitid'];

                $pdo = $this->prepare($sqlUpdateSchemaMonthly);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":dateofmonth", $dateofmonth, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->execute();
            }
            $lastWeek = $dayWeek;
        }
    }

    public function setAllocationSchema () {
        $periodid = $this->post->periodid;

        $sqlMonthly = "
            select
                a.id as schemanew,
                a.schemaweek,
                (
                    select
                        b.id
                    from
                        allocationschema b
                        inner join period q on ( q.id = b.periodid )
                    where date( concat(q.year,'-',q.month,'-',1) ) = adddate(date( concat(p.year,'-',p.month,'-',1) ), interval -1 month)
                ) as schemaold
            from
                allocationschema a
                inner join period p on ( p.id = a.periodid )
            where a.periodid = :periodid";

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

        $sqlWeekOld = "
            select
                sm.contractorunitid,
                smp.naturalpersonid,
                dayofweek(sm.dutydate) as dayofweek
            from
                allocationschema a
                inner join schedulingperiod sp on ( sp.periodid = a.periodid )
                inner join schedulingmonthly sm on ( sm.schedulingperiodid = sp.id )
                inner join schedulingmonthlypartners smp on ( smp.schedulingmonthlyid = sm.id )
            where a.id = :id
              and sm.shift = 'D'
              and dayofweek(sm.dutydate) between 2 and 6
              and sm.dutydate >= sp.periodof - interval 7 day
              and sm.dutydate <= sp.periodto
            order by dayofweek(sm.dutydate), sm.contractorunitid, sm.dutydate, smp.position";

        $pdo = $this->prepare($sqlMonthly);
        $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);

        $pdo->execute();
        $this->schemamonthly = self::encodeUTF8($pdo->fetchAll());
        $schemanew = intval($this->schemamonthly[0]["schemanew"]);
        $schemaold = intval($this->schemamonthly[0]["schemaold"]);

        $pdo = $this->prepare($sqlWeekDay);
        $pdo->bindValue(":allocationschemaid", $schemanew, \PDO::PARAM_INT);

        $pdo->execute();
        $this->schemaweekday = self::encodeUTF8($pdo->fetchAll());

        $pdo = $this->prepare($sqlWeekOld);
        $pdo->bindValue(":id", $schemaold, \PDO::PARAM_INT);

        $pdo->execute();
        $this->schemaweekold = self::encodeUTF8($pdo->fetchAll());
    }

    private function setTurningV (array $dayWeek) {
        $crsUnique = array();
        $tmpDaysOfWeek = array();

        // Remover duplicidades
        foreach($dayWeek as $record) {
            if(isset($record['position'])) unset($record['position']);
            if(isset($record['naturalpersonid'])) unset($record['naturalpersonid']);
            $crsUnique[] = $record;
        }
        $tmpUnique = array_map("unserialize", array_unique(array_map("serialize", $crsUnique)));

        // Fazer o Giro
        foreach($tmpUnique as $unit) {
            $position = 1;
            $crsDaysOfWeek = array();
            $list = self::searchArray($dayWeek,'contractorunitid',$unit['contractorunitid']);

            foreach ($list as $record) {
                $position = count($list) == $position ? 1 : ($position+1);
                $record['position'] = $position;
                $crsDaysOfWeek[] = $record;
            }

            // Ordenar Unidade pela Posição
            $sortedArray = self::sorterArray($crsDaysOfWeek,'position');

            foreach($sortedArray as $item) {
                array_push($tmpDaysOfWeek,$item);
            }
        }

        return $tmpDaysOfWeek;
    }

    public function callAction() {
        $action = $this->post->action;
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }

}