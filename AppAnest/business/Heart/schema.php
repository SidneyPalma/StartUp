<?php

namespace AppAnest\Heart;

use Smart\Utils\Session;
use AppAnest\Setup\Start;

class schema extends \Smart\Data\Proxy {

    /**
     * Estrutura contantedo os dias da Semana
     *
     * @var array
     */
    private $daysweek = array(
        array(1,2,3,4,5,6,7),
        array(1=>'sat',2=>'mon',3=>'tue',4=>'wed',5=>'thu',6=>'fri',7=>'sun')
    );

    /**
     * Esquema Semanal
     *
     * @var null
     */
    private $schemamonthly = null;

    /**
     * Mapa Giro Noturno
     *
     * @var null
     */
    private $schemaweekday = null;

    /**
     * Ultima semana periodo anterior
     *
     * @var null
     */
    private $schemaweekold = null;

    /**
     * Esquema Semanal Unidade/Sócio
     *
     * @var null
     */
    private $schemaunitday = null;

    /**
     * Lista de Sócios para Plantões Noturnos / MAPA
     *
     * @var null
     */
    private $naturalperson = null;

    private $sqlInsert = "
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

    private $sqlUpdate = "
                call setSchemaMonthlyUpdate (
                    :schedulingperiodid,
                    :naturalpersonid,
                    :contractorunitid,
                    :allocationschema,
                    :dateofmonth,
                    :shift,
                    :position
                );";

    public function __construct() {
        $this->post = (object)$_POST;

        $link = array(Start::getDataBase(), Start::getUserName(), Start::getPassWord());

        parent::__construct( $link );

        ini_set('max_execution_time', 600); // 10 minutos

        $this->setAllocationSchema();
    }

    public function selectTurningSchema () {
        $this->setSchemaMonthly();

        return self::getResultToJson();
    }

    public function callAction() {
        $action = $this->post->action;
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }

    private function setAllocationSchema () {
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
                asm.schemamap,
                etl.code as weekday,
                asm.weekold
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
                inner join allocationschemamap asm on (
                    asm.weekday = etl.code
                    and asm.allocationschemaid = :allocationschemaid
                )
            where et.name = 'weekday'
            order by etl.orderby";

        $sqlWeekOld = "
            select
            	sm.shift,
                smp.position,
                smp.allocationschema,
                sm.contractorunitid,
                smp.naturalpersonid,
                dayofweek(sm.dutydate) as dayofweek
            from
                allocationschema a
                inner join schedulingperiod sp on ( sp.periodid = a.periodid )
                inner join schedulingmonthly sm on ( sm.schedulingperiodid = sp.id )
                inner join schedulingmonthlypartners smp on ( smp.schedulingmonthlyid = sm.id )
            where a.id = :id
              and sm.dutydate >= sp.periodof - interval 7 day
              and sm.dutydate <= sp.periodto
            order by sm.shift, dayofweek(sm.dutydate), sm.contractorunitid, sm.dutydate, smp.allocationschema, smp.position";

        $sqlUnitDay = "
            select
                contractorunitid,
                naturalpersonid,
                shift,
                weekday,
                position
            from
                contractorunitschema
            order by
                naturalpersonid, weekday, shift, position";

        $sqlPartner = "
            select
                naturalpersonid, weekday, position
            from
                naturalpersondistribution
            where shift = 'P'
            order by weekday, position";

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

        $this->schemaunitday = self::encodeUTF8($this->query($sqlUnitDay)->fetchAll());
        $this->naturalperson = self::encodeUTF8($this->query($sqlPartner)->fetchAll());
    }

    private function setSchemaMonthly () {
        $dayscode = $this->daysweek[0];
        $periodid = $this->post->periodid;

        // Limpando Tabela Temporária
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

        foreach($dayscode as $dayofweek) {
            $pdo = $this->prepare($sqlDaysWeek);
            $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);
            $pdo->bindValue(":dayofweek", $dayofweek, \PDO::PARAM_INT);
            $pdo->execute();
            $dayList = $pdo->fetchAll();
            $this->setSchema000($dayList);

            if($dayofweek != 1 && $dayofweek != 7) {
                $this->setSchema001($dayList,$dayofweek);
                $this->setSchema002($dayList,$dayofweek);
                $this->setSchema003($dayList,$dayofweek);
            }
        }
    }

    private function setTurningH (array $dayWeek, $week, $partners) {
        $returns = array();
        $weekold = intval($dayWeek['weekold']);
        $lastWeek = self::jsonToArray($dayWeek['schemamap']);
        $weeks = (($weekold + $week) > count($lastWeek)) ? (($weekold + $week) - count($lastWeek)) : ($weekold + $week);
        $weeknew = 'week' . str_pad($weeks,2,"0",STR_PAD_LEFT);

        $i = 0;
        $position = 1;
        $contractorunitid = 0;

        foreach($lastWeek as $record) {
            $week = intval($record[$weeknew]);
            $partner = self::searchArray($partners,'position',$week);

            $position = ($contractorunitid == intval($record['contractorunitid'])) ? $position : 1;

            $returns[$i]['position'] = $position;
            $returns[$i]['contractorunitid'] = intval($record['contractorunitid']);
            $returns[$i]['naturalpersonid'] = intval($partner[0]['naturalpersonid']);

            $i++;
            $position++;
            $contractorunitid = intval($record['contractorunitid']);
        }

        return $returns;
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

    private function setSchema000 (array $dayList) {
        $username = Session::read('username');
        $schemaweek = self::jsonToArray($this->schemamonthly[0]["schemaweek"]);

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
                $pdo = $this->prepare($this->sqlInsert);
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

    private function setSchema001 (array $dayList, $dayofweek) {
//        $shiftDay = self::searchArray($this->schemaweekold,'shift','D');
        $shiftDay = self::searchArray($this->schemaweekold,'allocationschema','001');
        $lastWeek = self::searchArray($shiftDay,'dayofweek',$dayofweek);

        foreach($dayList as $m) {
            $dateofmonth = $m['dateofmonth'];
            $schedulingperiodid = $m['schedulingperiodid'];
            $dayWeek = $this->setTurningV($lastWeek);

            foreach($dayWeek as $d) {
                $position = $d['position'];
                $naturalpersonid = $d['naturalpersonid'];
                $contractorunitid = $d['contractorunitid'];

                $pdo = $this->prepare($this->sqlUpdate);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", '001', \PDO::PARAM_STR);
                $pdo->bindValue(":dateofmonth", $dateofmonth, \PDO::PARAM_STR);
                $pdo->bindValue(":shift", 'D', \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->execute();
            }
            $lastWeek = $dayWeek;
        }
    }

    private function setSchema002 (array $dayList, $dayofweek) {
        $daysname = $this->daysweek[1];
        $lastWeek = self::searchArray($this->schemaweekday,'weekday',$daysname[$dayofweek])[0];
        $partners = self::searchArray($this->naturalperson,'weekday',$daysname[$dayofweek]);

        $week = 1;
        foreach($dayList as $m) {
            $dateofmonth = $m['dateofmonth'];
            $schedulingperiodid = intval($m['schedulingperiodid']);
            $dayWeek = $this->setTurningH($lastWeek, $week, $partners);

            foreach($dayWeek as $d) {
                $position = intval($d['position']);
                $naturalpersonid = intval($d['naturalpersonid']);
                $contractorunitid = intval($d['contractorunitid']);

                $pdo = $this->prepare($this->sqlUpdate);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", '002', \PDO::PARAM_STR);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":dateofmonth", $dateofmonth, \PDO::PARAM_STR);
                $pdo->bindValue(":shift", 'N', \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->execute();
            }
            $week++;
        }
    }

    private function setSchema003 (array $dayList, $dayofweek) {
        $shiftDay = self::searchArray($this->schemaweekold,'allocationschema','003');
        $lastWeek = self::searchArray($shiftDay,'dayofweek',$dayofweek);

        foreach($dayList as $m) {
            $dateofmonth = $m['dateofmonth'];
            $schedulingperiodid = $m['schedulingperiodid'];
            $dayWeek = $this->setTurningV($lastWeek);

            foreach($dayWeek as $d) {
                $shift =$d['shift'];
                $position = $d['position'];
                $naturalpersonid = $d['naturalpersonid'];
                $contractorunitid = $d['contractorunitid'];
                $allocationschema = $d['allocationschema'];

                $pdo = $this->prepare($this->sqlUpdate);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", $allocationschema, \PDO::PARAM_STR);
                $pdo->bindValue(":dateofmonth", $dateofmonth, \PDO::PARAM_STR);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->execute();
            }
            $lastWeek = $dayWeek;
        }
    }

    private function setSchema004 () {
    }

    private function setSchema010 () {
    }

    private function setSchema011 () {
    }

    private function setSchema012 () {
    }

    private function setSchema013 () {
    }

}