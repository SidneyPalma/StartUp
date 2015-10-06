<?php

namespace AppAnest\Cache;

use AppAnest\Model\schedulingmonthlypartners as Model;
use Smart\Utils\Session;

class schedulingmonthlypartners extends \Smart\Data\Cache {

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
     * Get an array of \DateTime objects for each day (specified) in a year and month
     *
     * @param integer $year
     * @param integer $month
     * @param string $day
     * @param integer $daysError    Number of days into month that requires inclusion of previous Monday
     * @return array|\DateTime[]
     * @throws Exception      If $year, $month and $day don't make a valid strtotime
     * @author http://stackoverflow.com/questions/28213048/every-monday-of-the-month-in-php
     *
     * How ToUse
     *
     * $days = getAllDaysInAMonth(2015, 9, 'Sunday');
     *
     * foreach ($days as $day) {
     *     echo $day->format('Y-m-d').'<br />';
     * }
     *
     */
    private function getAllDaysInAMonth($year, $month, $day = 'Monday', $daysError = 3) {
        $days = array();
        $dateString = 'first '.$day.' of '.$year.'-'.$month;

        if (!strtotime($dateString)) {
            throw new \Exception('"'.$dateString.'" is not a valid strtotime');
        }

        $startDay = new \DateTime($dateString);

        if ($startDay->format('j') > $daysError) {
            $startDay->modify('- 7 days');
        }

        while ($startDay->format('Y-m') <= $year.'-'.str_pad($month, 2, 0, STR_PAD_LEFT)) {
            $days[] = clone($startDay);
            $startDay->modify('+ 7 days');
        }

        return $days;
    }

    public function startScheduleScore (array $data) {
        $periodid = $data['periodid'];
        $username = Session::read('username');
        $proxy = $this->getStore()->getProxy();

        $sql = "
            set @periodid = :periodid;
            set @username = :username;

            call setScheduleScore(@periodid,@username);";

        $pdo = $proxy->prepare($sql);
        $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);
        $pdo->bindValue(":username", $username, \PDO::PARAM_STR);
        $pdo->execute();

        return self::getResultToJson();
    }

    public function setPublishSchedule (array $data) {
        $periodid = $data['periodid'];
        $username = Session::read('username');
        $proxy = $this->getStore()->getProxy();

        $sql = "
            set @periodid = :periodid;
            set @username = :username;

            call setPublishSchedule(@periodid,@username);";

        $pdo = $proxy->prepare($sql);
        $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);
        $pdo->bindValue(":username", $username, \PDO::PARAM_STR);
        $pdo->execute();

        return self::getResultToJson();
    }

    public function selectCode(array $data) {
        $query = $data['query'];
        $dataIndex = $data['dataIndex'];
        $username = Session::read('username');
        $proxy = $this->getStore()->getProxy();

        $sql = "
                select
                    smp.id,
                    sm.schedulingperiodid,
                    sm.contractorunitid,
                    sm.dutydate,
                    sm.shift,
                    smp.shifthours,
                    smp.schedulingmonthlyid,
                    smp.naturalpersonid,
                    smp.position,
                    smp.shift,
                    smp.subunit,
                    smp.allocationschema,
                    smp.releasetype,
                    smp.username,
                    smp.observation as observationlog,
                    p.shortname as naturalperson,
                    cu.shortname as contractorunit,
                    getEnum('shift',smp.shift) as shiftdescription,
                    getEnum('subunit',smp.subunit) as subunitdescription,
                    getEnum('releasetype',smp.releasetype) as releasetypedescription,
                    getEnum('allocationschema',smp.allocationschema) as allocationschemadescription
                from
                    schedulingmonthlypartners smp
                    inner join schedulingmonthly sm on ( sm.id = smp.schedulingmonthlyid )
                    inner join person p on ( p.id = smp.naturalpersonid )
                    inner join person cu on ( cu.id = sm.contractorunitid )
                where smp.id = :id";

        if($data['rows'][$dataIndex . 'description'] == '...') {
            $shift = $data['rows']['shift'];
            $subunit = $data['rows']['subunit'];
            $position = $data['rows']['position'];
            $schedulingmonthlyid = $data['rows'][$dataIndex];
            $dutydate = $data['rows'][$dataIndex. 'dutydate'];
            $contractorunit = $data['rows']['contractorunit'];
            $contractorunitid = $data['rows']['contractorunitid'];
            $allocationschema = $data['rows'][$dataIndex. 'schema'];

            $sql = "
                select
                    $query as id,
                    $contractorunitid as contractorunitid,
                    '$contractorunit' as contractorunit,
                    $schedulingmonthlyid as schedulingmonthlyid,
                    null as naturalperson,
                    null as naturalpersonid,
                    '$dutydate' as dutydate,
                    '$username' as username,
                    $position as position,
                    '$shift' as shift,
                    getEnum('shift','$shift') as shiftdescription,
                    '$subunit' as subunit,
                    getEnum('subunit','$subunit') as subunitdescription,
                    'M' as releasetype,
                    getEnum('releasetype','M') as releasetypedescription,
                    '$allocationschema' as allocationschema,
                    getEnum('allocationschema','$allocationschema') as allocationschemadescription";

            $rows = $proxy->query($sql)->fetchAll();
        } else {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":id", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();
        }

        self::_setRows($rows);

        return self::getResultToJson();
    }

    private $sqlUnique = "
        select
            sm.contractorunitid,
            c.shortname as contractorunit,
            tp.shift,
            tp.subunit,
            tp.position
        from
            schedulingmonthly sm
            inner join contractorunit cu on ( cu.id = sm.contractorunitid )
            inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
            inner join _tablename_ tp on ( tp.schedulingmonthlyid = sm.id )
            inner join person c on ( c.id = sm.contractorunitid )
            left join person n on ( n.id = tp.naturalpersonid )
        where sp.id = :period
          and sm.dutydate between :dateof and :dateto
        group by cu.position, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

    private $sqlSelect = "
            select
                tp.id,
                sm.dutydate,
                sm.contractorunitid,
                c.shortname as contractorunit,
                substring(lower(dayname(sm.dutydate)),1,3) as dutyname,
                tp.position,
                tp.naturalpersonid,
                n.shortname as naturalperson,
                tp.shift,
                tp.subunit,
                tp.releasetype,
                tp.allocationschema
            from
                schedulingmonthly sm
                inner join contractorunit cu on ( cu.id = sm.contractorunitid )
                inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
                inner join _tablename_ tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
                left join person n on ( n.id = tp.naturalpersonid )
            where sp.id = :period
              and sm.dutydate between :dateof and :dateto
            order by sm.dutydate, cu.position, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

    private function setTableSchedule ($period, $sql) {
        $list = array("P", "C", "E");
        $proxy = $this->getStore()->getProxy();

        $rows = $proxy->query("select status from schedulingperiod where id = $period")->fetchAll();
        $status = $rows[0]['status'];

        $tablename = (in_array($status, $list)) ? 'schedulingmonthlypartners' : 'tmp_turningmonthly';

        return str_replace("_tablename_", $tablename, $sql);
    }

    private function selectView(array $unique, array $select) {
        $n = 1;
        $daysname = $this->daysweek['daysname'];

        foreach($daysname as $key=>$d) {
            $i = 0;
            $j = 0;
            $s = self::searchArray($select,'dutyname',$d);

            $contractorunitid = '';

            foreach($unique as $u) {
                $b = 0;
                $search = $s;
                $search = self::searchArray($search,'contractorunitid',$u['contractorunitid']);
                $search = self::searchArray($search,'shift',$u['shift']);
                $search = self::searchArray($search,'subunit',$u['subunit']);
                $search = self::searchArray($search,'position',$u['position']);

                if($contractorunitid != $u['contractorunitid']) {
                    $j++;
                    $b = 1;
                }

                $unique[$i]['id'] = $n;
                $unique[$i]['bordertop'] = $b;
                $unique[$i]['rownumber'] = $j;
                $unique[$i][$d.'description'] = '...';

                if(isset($search[0])) {
                    $unique[$i][$d] = $search[0]['id'];
                }

                $contractorunitid = $u['contractorunitid'];

                if(isset($search[0]['dutydate'])) {
                    $unique[$i][$d.'dutydate'] = $search[0]['dutydate'];
                }
                if(isset($search[0]['allocationschema'])) {
                    $unique[$i][$d.'schema'] = $search[0]['allocationschema'];
                }
                if(isset($search[0]['naturalperson'])) {
                    $unique[$i][$d.'description'] = $search[0]['naturalperson'];
                }

                $i++;
                $n++;
            }
        }

        return $unique;
    }

    public function selectMonth(array $return, array $data) {
        $result = array();
        $dateOf = $data['dateOf'];
        $period =  new \DateTime($dateOf);
        $y = intval($period->format('Y'));
        $m = intval($period->format('m'));
        $daysname = $this->daysweek['daysname'];

        foreach($daysname as $key=>$val) {
            $i = 0;
            $daysweek = $this->getAllDaysInAMonth($y,$m,$val);

            foreach($daysweek as $day) {
                $finded = $day->format('Y-m-d');
                $search = self::searchArray($return,'dutydate',$finded);
                $contractorunit = '';
                foreach($search as $record) {
                    $contractorunit .= '<br/>'. $record['contractorunit'];
                }
                $result[$i][$val . 'description'] = $contractorunit;

                $i++;
            }
        }

        return $result;
    }

    public function selectSchedule(array $data) {
        $dateOf = $data['dateOf'];
        $dateTo = $data['dateTo'];
        $period = $data['period'];
        $proxy = $this->getStore()->getProxy();

        $sqlUnique = $this->setTableSchedule($period,$this->sqlUnique);
        $pdo = $proxy->prepare($sqlUnique);
        $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
        $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
        $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
        $pdo->execute();
        $unique = self::encodeUTF8($pdo->fetchAll());

        $sqlSelect = $this->setTableSchedule($period,$this->sqlSelect);
        $pdo = $proxy->prepare($sqlSelect);
        $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
        $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
        $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
        $pdo->execute();
        $select = self::encodeUTF8($pdo->fetchAll());

        $return = $this->selectView($unique,$select);

        unset($pdo);
        unset($proxy);

        try {
            self::_setRows($return);
        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectSchedulePicker(array $data) {
        $result = array();
        $period = $data['period'];
        $proxy = $this->getStore()->getProxy();

        $sqlPicker = "
            select
                @dutydate := concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')) as dutydate,
                SUBDATE(@dutydate, WEEKDAY(@dutydate)) as dateof,
                DATE(SUBDATE(@dutydate, WEEKDAY(@dutydate)) + INTERVAL (8 - DAYOFWEEK(SUBDATE(@dutydate, WEEKDAY(@dutydate)))) DAY) as dateto,
                sp.periodof,
                sp.periodto
            from
                ( select
                    @row := @row + 1 as row
                  from
                    ( select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6 ) t1,
                    ( select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6 ) t2,
                    ( select @row:=-1 ) t3 limit 31
                ) b,
                schedulingperiod sp
            where sp.id = :period
              and date_add(sp.periodof, interval row day) between sp.periodof and sp.periodto
            group by dateof, dateto";

        $pdo = $proxy->prepare($sqlPicker);
        $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
        $pdo->execute();
        $picker = $pdo->fetchAll();

        $id = 0;

        foreach($picker as $record) {
            $dateof = $record['dateof'];
            $dateto = $record['dateto'];

            $day = 0;
            $date = new \DateTime($dateof);

            while ($date->format('Y-m-d') != $dateto) {
                $date->modify("+ $day days");
                $record[strtolower($date->format("D"))] = $date->format('Y-m-d');
                $day = 1;
            }

            $id++;
            $record['id'] = $id;
            $result[] = $record;
        }


        unset($pdo);
        unset($proxy);

        try {
            self::_setRows($result);
        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}