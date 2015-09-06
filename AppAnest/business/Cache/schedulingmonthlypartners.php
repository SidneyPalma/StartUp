<?php

namespace AppAnest\Cache;

use AppAnest\Model\schedulingmonthlypartners as Model;

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

    private $sqlMonthly = "
            select
                sm.dutydate,
                sm.contractorunitid,
                c.shortname as contractorunit,
                substring(lower(dayname(sm.dutydate)),1,3) as dutyname
            from
                schedulingmonthly sm
                inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
                inner join tmp_turningmonthly tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
            where sp.periodid = :period
            group by sm.dutydate, sm.contractorunitid";

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
            inner join tmp_turningmonthly tp on ( tp.schedulingmonthlyid = sm.id )
            inner join person c on ( c.id = sm.contractorunitid )
            left join person n on ( n.id = tp.naturalpersonid )
        where sp.periodid = :period
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
                inner join tmp_turningmonthly tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
                left join person n on ( n.id = tp.naturalpersonid )
            where sp.periodid = :period
              and sm.dutydate between :dateof and :dateto
            order by sm.dutydate, cu.position, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

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

                $contractorunitid = $u['contractorunitid'];

                if(isset($search[0]['dutydate'])) {
                    $unique[$i][$d.'dutydate'] = $search[0]['dutydate'];
                }
                if(isset($search[0]['allocationschema'])) {
                    $unique[$i][$d.'schema'] = $search[0]['allocationschema'];
                }
                if(isset($search[0]['naturalperson'])) {
                    $unique[$i][$d] = $search[0]['naturalpersonid'];
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
        $picker = $data['pickerView'];
        $proxy = $this->getStore()->getProxy();

        if($picker == 'vwMonth') {
            $pdo = $proxy->prepare($this->sqlMonthly);
            $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
            $pdo->execute();
            $result = $pdo->fetchAll();
            $return = $this->selectMonth($result,$data);
        } else {
            $pdo = $proxy->prepare($this->sqlUnique);
            $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
            $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
            $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
            $pdo->execute();
            $unique = self::encodeUTF8($pdo->fetchAll());

            $pdo = $proxy->prepare($this->sqlSelect);
            $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
            $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
            $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
            $pdo->execute();
            $select = self::encodeUTF8($pdo->fetchAll());

            $return = $this->selectView($unique,$select);
        }

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

}