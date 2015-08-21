<?php

namespace AppAnest\Heart;

use Smart\Utils\Session;
use AppAnest\Setup\Start;

class schema extends \Smart\Data\Proxy {

    /**
     * Estrutura contendo os dias da Semana
     *
     * @var array
     */
    private $daysweek = array(
        'dayscode'=>array(1,2,3,4,5,6,7),
        'daysname'=>array(1=>'sun',2=>'mon',3=>'tue',4=>'wed',5=>'thu',6=>'fri',7=>'sat')
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
            set @schedulingperiodid = :schedulingperiodid;
            set @contractorunitid = :contractorunitid;
            set @allocationschema = :allocationschema;
            set @position = :position;
            set @dutydate = :dutydate;
            set @username = :username;
            set @subunit = :subunit;
            set @shift = :shift;

            insert into
                tmp_turningmonthly
                    ( schedulingmonthlyid, position, shift, subunit, allocationschema, username )
            select
                id,
                @position as position,
                shift,
                @subunit as subunit,
                @allocationschema as allocationschema,
                @username as username
            from
                schedulingmonthly
            where schedulingperiodid = @schedulingperiodid
              and contractorunitid = @contractorunitid
              and dutydate = @dutydate
              and shift = @shift;";

    private $sqlUpdate = "
            set @schedulingperiodid = :schedulingperiodid;
            set @contractorunitid = :contractorunitid;
            set @allocationschema = :allocationschema;
            set @naturalpersonid = :naturalpersonid;
            set @position = :position;
            set @dutydate = :dutydate;
            set @shift = :shift;

            update
                tmp_turningmonthly tp
                inner join schedulingmonthly sm on (
                        sm.schedulingperiodid = @schedulingperiodid
                    and sm.contractorunitid = @contractorunitid
                    and sm.dutydate = @dutydate
                    and tp.schedulingmonthlyid = sm.id
                    and tp.shift = @shift
                    and tp.allocationschema = @allocationschema
                    and tp.position = @position
                )
            set tp.naturalpersonid = @naturalpersonid;";

    private $sqlCaptar = "
            set @schedulingperiodid = :schedulingperiodid;
            set @contractorunitid = :contractorunitid;
            set @allocationschema = :allocationschema;
            set @position = :position;
            set @dutydate = :dutydate;
            set @shift = :shift;
            set @schema = ( select substring(getEnum('allocationschema',@allocationschema),8,4) );
            set @naturalpersonid = (
                        select
                             tt.naturalpersonid
                        from
                            tmp_turningmonthly tt
                            inner join schedulingmonthly sm on (
                                    sm.schedulingperiodid = @schedulingperiodid
                                and sm.contractorunitid = @contractorunitid
                                and sm.dutydate = @dutydate
                                and sm.shift = 'D'
                                and tt.schedulingmonthlyid = sm.id
                                and tt.shift = sm.shift
                                and tt.subunit = substring(@schema,1,1)
                                and tt.position = substring(@schema,3,2)
                            )
                        limit 1
                );

                update
                    tmp_turningmonthly t
                    inner join schedulingmonthly s on (
                            s.schedulingperiodid = @schedulingperiodid
                        and s.contractorunitid = @contractorunitid
                        and s.dutydate = @dutydate
                        and s.shift = @shift
                        and t.schedulingmonthlyid = s.id
                        and t.shift = s.shift
                        and t.allocationschema = @allocationschema
                        and t.position = @position
                    )
                set t.naturalpersonid = @naturalpersonid;";

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
            order by sm.shift, sm.contractorunitid, sm.dutydate, smp.allocationschema, smp.position";

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
                contractorunitid, weekday, shift, position";

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
        $periodid = $this->post->periodid;
        $dayscode = $this->daysweek['dayscode'];

        // Limpando Tabela Temporária
        $this->exec("
                  delete from tmp_turningmonthly where id > 0;
                  alter table tmp_turningmonthly AUTO_INCREMENT = 1;");

        $sqlDaysWeek = "
            select
                sp.id as schedulingperiodid,
                concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')) as dutydate,
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
                $this->setSchema013($dayList,$dayofweek);
                $this->setCaptarAll($dayList,$dayofweek);
            }

            $this->setSchema011($dayList,$dayofweek);
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

        $tmpUnique = self::uniqueArray($crsUnique);

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

        return self::uniqueArray($tmpDaysOfWeek);
    }

    private function setShiftUnit (array $unit, $dayofweek) {
        $daysname = $this->daysweek['daysname'][$dayofweek];
        $shift = $unit['shift'];
        $naturalpersonid = $unit['naturalpersonid'];
        $contractorunitid = $unit['contractorunitid'];

        $unitSchema = self::searchArray($this->schemaunitday,'contractorunitid',$contractorunitid);
        $unitSchema = self::searchArray($unitSchema,'weekday',$daysname);
        $unitSchema = self::searchArray($unitSchema,'shift',$shift);

        $record = self::searchArray($unitSchema,'naturalpersonid',$naturalpersonid);

        $position = $record[0]['position'];

        $position = (($position+1) > count($unitSchema)) ? 1 : $position+1;

        $record = self::searchArray($unitSchema,'position',$position);

        return $record[0]['naturalpersonid'];
    }

    private function setSchema000 (array $dayList) {
        $username = Session::read('username');
        $schemaweek = self::jsonToArray($this->schemamonthly[0]["schemaweek"]);

        foreach($dayList as $a) {
            $dayname = $a['dayname'];
            $dutydate = $a['dutydate'];
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
                $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->bindValue(":username", $username, \PDO::PARAM_STR);
                $pdo->bindValue(":subunit", $subunit, \PDO::PARAM_STR);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->execute();
            }
        }
    }

    private function setSchema001 (array $dayList, $dayofweek) {
        $shift001 = self::searchArray($this->schemaweekold,'allocationschema','001');
        $shift012 = self::searchArray($this->schemaweekold,'allocationschema','012');

        $shiftDay = array_merge($shift001,$shift012);

        $lastWeek = self::searchArray($shiftDay,'dayofweek',$dayofweek);

        foreach($dayList as $m) {
            $dutydate = $m['dutydate'];
            $schedulingperiodid = $m['schedulingperiodid'];
            $dayWeek = $this->setTurningV($lastWeek);

            foreach($dayWeek as $d) {
                $shift = $d['shift'];
                $position = $d['position'];
                $naturalpersonid = $d['naturalpersonid'];
                $contractorunitid = $d['contractorunitid'];
                $allocationschema = $d['allocationschema'];

                if($allocationschema == '012') {
                    $naturalpersonid = $this->setShiftUnit($d,$dayofweek);
                }

                $pdo = $this->prepare($this->sqlUpdate);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", $allocationschema, \PDO::PARAM_STR);
                $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->execute();
            }

            $lastWeek = $dayWeek;
        }
    }

    private function setSchema002 (array $dayList, $dayofweek) {
        $daysname = $this->daysweek['daysname'];
        $lastWeek = self::searchArray($this->schemaweekday,'weekday',$daysname[$dayofweek])[0];
        $partners = self::searchArray($this->naturalperson,'weekday',$daysname[$dayofweek]);

        $week = 1;
        foreach($dayList as $m) {
            $dutydate = $m['dutydate'];
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
                $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
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
            $dutydate = $m['dutydate'];
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
                $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->execute();
            }
            $lastWeek = $dayWeek;
        }
    }

    private function setCaptarAll (array $dayList, $dayofweek) {
        $allocationCaptar = array('004','005','006','007','008','009');

        foreach($allocationCaptar as $allocationschema) {
            $shiftDay = self::searchArray($this->schemaweekold,'allocationschema',$allocationschema);
            $lastWeek = self::searchArray($shiftDay,'dayofweek',$dayofweek);

            foreach($dayList as $m) {
                $dutydate = $m['dutydate'];
                $schedulingperiodid = $m['schedulingperiodid'];

                foreach($lastWeek as $d) {
                    $shift =$d['shift'];
                    $position = $d['position'];
                    $contractorunitid = $d['contractorunitid'];

                    $pdo = $this->prepare($this->sqlCaptar);
                    $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                    $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                    $pdo->bindValue(":allocationschema", $allocationschema, \PDO::PARAM_STR);
                    $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
                    $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                    $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                    $pdo->execute();
                }
            }
        }
    }

    private function setSchema010 () {
    }

    private function setSchema011 (array $dayList, $dayofweek) {
        $shift010 = self::searchArray($this->schemaweekold,'allocationschema','010');
        $shift011 = self::searchArray($this->schemaweekold,'allocationschema','011');

        $shiftDay = array_merge($shift010,$shift011);
        $lastWeek = self::searchArray($shiftDay,'dayofweek',$dayofweek);

        foreach($dayList as $m) {
            $dutydate = $m['dutydate'];
            $schedulingperiodid = $m['schedulingperiodid'];

            foreach($lastWeek as $d) {
                $shift = $d['shift'];
                $position = $d['position'];
                $naturalpersonid = $d['naturalpersonid'];
                $contractorunitid = $d['contractorunitid'];
                $allocationschema = $d['allocationschema'];

                $pdo = $this->prepare($this->sqlUpdate);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", $allocationschema, \PDO::PARAM_STR);
                $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->execute();
            }
        }
    }

    private function setSchema013 (array $dayList, $dayofweek) {
        $shiftDay = self::searchArray($this->schemaweekold,'allocationschema','013');
        $lastWeek = self::searchArray($shiftDay,'dayofweek',$dayofweek);

        foreach($dayList as $m) {
            $dutydate = $m['dutydate'];
            $schedulingperiodid = $m['schedulingperiodid'];

            foreach($lastWeek as $d) {

                $shift = $d['shift'];
                $position = $d['position'];
                $contractorunitid = $d['contractorunitid'];
                $allocationschema = $d['allocationschema'];
                $naturalpersonid = $this->setShiftUnit($d,$dayofweek);

                $pdo = $this->prepare($this->sqlUpdate);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":allocationschema", $allocationschema, \PDO::PARAM_STR);
                $pdo->bindValue(":dutydate", $dutydate, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->bindValue(":shift", $shift, \PDO::PARAM_STR);
                $pdo->execute();
            }
        }
    }

}