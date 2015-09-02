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

        try {
            self::_setRows($unique);
        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectSchedule(array $data) {
        $dateOf = $data['dateOf'];
        $dateTo = $data['dateTo'];
        $period = $data['period'];
        $proxy = $this->getStore()->getProxy();

        $pdo = $proxy->prepare($this->sqlUnique);
        $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
        $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
        $pdo->bindValue(":period", $period, \PDO::PARAM_STR);
        $pdo->execute();
        $unique = self::encodeUTF8($pdo->fetchAll());

        $pdo = $proxy->prepare($this->sqlSelect);
        $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
        $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
        $pdo->bindValue(":period", $period, \PDO::PARAM_STR);
        $pdo->execute();
        $select = self::encodeUTF8($pdo->fetchAll());

        unset($pdo);
        unset($proxy);

        return $this->selectView($unique,$select);
    }

}