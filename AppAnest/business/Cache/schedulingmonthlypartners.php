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
        select distinct
            sm.contractorunitid,
            c.shortname as contractorunit,
            tp.position,
            tp.shift,
            tp.subunit
        from
            schedulingmonthly sm
            inner join contractorunit cu on ( cu.id = sm.contractorunitid )
            inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
            inner join tmp_turningmonthly tp on ( tp.schedulingmonthlyid = sm.id )
            inner join person c on ( c.id = sm.contractorunitid )
            left join person n on ( n.id = tp.naturalpersonid )
        where sp.periodid = 2
          and sm.dutydate between '2015-07-01' and '2015-07-07'
        order by sm.dutydate, cu.position, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

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
            where sp.periodid = 2
              and sm.dutydate between '2015-07-01' and '2015-07-07'
            order by sm.dutydate, cu.position, sm.contractorunitid, tp.id, tp.shift, tp.subunit, tp.position";

    public function selectSchedule(array $data) {

        $proxy = $this->getStore()->getProxy();
        $daysname = $this->daysweek['daysname'];
        $unique = self::encodeUTF8($proxy->query($this->sqlUnique)->fetchAll());
        $select = self::encodeUTF8($proxy->query($this->sqlSelect)->fetchAll());

        $n = 1;

        foreach($daysname as $key=>$d) {
            $i = 0;
            $s = self::searchArray($select,'dutyname',$d);

            foreach($unique as $u) {
                $search = $s;
                $search = self::searchArray($search,'contractorunitid',$u['contractorunitid']);
                $search = self::searchArray($search,'position',$u['position']);
                $search = self::searchArray($search,'subunit',$u['subunit']);
                $search = self::searchArray($search,'shift',$u['shift']);

                $unique[$i]['id'] = $n;
                if(isset($search[0]['naturalperson'])) {
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

}