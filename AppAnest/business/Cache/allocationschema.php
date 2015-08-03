<?php

namespace AppAnest\Cache;

use AppAnest\Model\allocationschema as Model;

class allocationschema extends \Smart\Data\Cache {

    private function setTurningVerticalByLastWeek (array $data) {
        $id = 5;

        $removeAll = array();
        $removeUnt = array();
        $removeDay = array();
//        $removeAll = array('409');
//        $removeUnt = array(array('344'=>'41'));
//        $removeDay = array(array('344'=>'mon'));

        $proxy = $this->getStore()->getProxy();

        // Obter LastWeek
        $sqlLastWeek = "
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
              and sm.dutydate <  sp.periodto
            order by dayofweek(sm.dutydate), sm.contractorunitid, sm.dutydate, smp.position";

        // criando primeira semana
        $pdo = $proxy->prepare($sqlLastWeek);
        $pdo->bindValue(":id", $id, \PDO::PARAM_INT);
        $pdo->execute();
        $lastWeek = self::encodeUTF8($pdo->fetchAll());

        // remover socio da lista
        foreach ($removeAll as $value) {
            $finded = self::searchArray($lastWeek,'naturalpersonid',$value);
            foreach ($finded as $element) {
                $key = array_search($element, $lastWeek);
                if($key) unset($lastWeek[$key]);
            }
        }
        foreach ($removeUnt as $value) {

        }
        foreach ($removeDay as $value) {

        }

        $week = array('dayWeek'=>'2','week'=>$lastWeek);

        $this->setTurningVerticalDaysOfWeek($week);
    }

    private function setTurningVerticalDaysOfWeek (array $data) {
        $dayList = $data['week'];
        $dayWeek = $data['dayWeek'];
        $proxy = $this->getStore()->getProxy();

        $sqlListWeek = "
            select
                sp.id as schedulingperiodid,
                concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')) as dateofmonth,
                substring(lower(dayname(concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')))),1,3) as dayname
            from
                ( select @row := @row + 1 as row
                    from
                  (select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6) t1,
                  (select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6) t2,
                  (select @row:=-1) t3 limit 31
                ) b,
                schedulingperiod sp
                where sp.periodid = 2
                  and date_add(sp.periodof, interval row day) between sp.periodof and sp.periodto
                  and dayofweek(date_add(sp.periodof, interval row day)) = 2";

        $rows = $proxy->query($sqlListWeek)->fetchAll();

        $sql = "call getLoopOut(:schedulingperiodid,:naturalpersonid,:contractorunitid,:dateofmonth,'D',:position,'samuel.dasilva');";

        foreach($rows as $m) {
            $dateofmonth = $m['dateofmonth'];
            $schedulingperiodid = $m['schedulingperiodid'];
            $dayWeek = $this->setTurningV($dayList);
            foreach($dayWeek as $d) {
                $position = $d['position'];
                $naturalpersonid = $d['naturalpersonid'];
                $contractorunitid = $d['contractorunitid'];

                $pdo = $proxy->prepare($sql);
                $pdo->bindValue(":schedulingperiodid", $schedulingperiodid, \PDO::PARAM_INT);
                $pdo->bindValue(":naturalpersonid", $naturalpersonid, \PDO::PARAM_INT);
                $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
                $pdo->bindValue(":dateofmonth", $dateofmonth, \PDO::PARAM_STR);
                $pdo->bindValue(":position", $position, \PDO::PARAM_INT);
                $pdo->execute();
            }
            $dayList = $dayWeek;
        }
    }

    private function setTurningV (array $dayWeek) {
        $crsUnique = array();
        $tmpDaysOfWeek = array();

        foreach($dayWeek as $record) {
            if(isset($record['position'])) unset($record['position']);
            if(isset($record['naturalpersonid'])) unset($record['naturalpersonid']);
            $crsUnique[] = $record;
        }

        $tmpUnique = array_map("unserialize", array_unique(array_map("serialize", $crsUnique)));

        foreach($tmpUnique as $unit) {
            $position = 1;
            $crsDaysOfWeek = array();
            $list = self::searchArray($dayWeek,'contractorunitid',$unit['contractorunitid']);

            foreach ($list as $record) {
                $position = count($list) == $position ? 1 : ($position+1);
                $record['position'] = $position;
                $crsDaysOfWeek[] = $record;
            }

            $sortedArray = self::sorterArray($crsDaysOfWeek,'position');

            foreach($sortedArray as $item) {
                array_push($tmpDaysOfWeek,$item);
            }
        }

        return $tmpDaysOfWeek;
    }

    public function setTurningVertical (array $data) {
        $id = $data['id'];
        $proxy = $this->getStore()->getProxy();

        // Obter histórico
        $sqlSchemaWeek = "select schemaweek from allocationschema where id = :id";

        $pdo = $proxy->prepare($sqlSchemaWeek);

        $pdo->bindValue(":id", $id, \PDO::PARAM_INT);

        $pdo->execute();
        $week = self::encodeUTF8($pdo->fetchAll());

        $this->setTurningVerticalByLastWeek($data);

        self::_setRows($week);

        return self::getResultToJson();
    }

    public function selectLike(array $data) {
        $start = $data['start'];
        $limit = $data['limit'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                a.id,
                a.periodid,
                a.schemaweek,
                a.description,
                a.observation,
                p.year,
                p.month,
                concat(lpad(p.year,4,'0'),'-',lpad(p.month,2,'0'),'-','01') as periodof,
                last_day(concat(lpad(p.year,4,'0'),'-',lpad(p.month,2,'0'),'-','01')) as periodto
            from
                period p
                inner join allocationschema a on ( a.periodid = p.id )
            order by p.year, p.month";

        try {
            $rows = $proxy->query($sql)->fetchAll();

            self::_setRows($rows);
            self::_setPage($start,$limit);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectCode(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                a.id,
                a.periodid,
                a.username,
                a.schemaweek,
                a.description,
                a.observation
            from
                allocationschema a
            where periodid = :personid";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":personid", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectWeek(array $data) {
        $allocationschemaid = $data['allocationschemaid'];
        $proxy = $this->getStore()->getProxy();
        $crsContractorUnit = array();

        // Obter histórico
        $sqlSchemaWeek = "select schemaweek from allocationschema where id = :allocationschemaid";

        $pdo = $proxy->prepare($sqlSchemaWeek);

        $pdo->bindValue(":allocationschemaid", $allocationschemaid, \PDO::PARAM_INT);

        $pdo->execute();
        $week = self::encodeUTF8($pdo->fetchAll());

        if(count($week) != 0) {
            $schemaweek = $week[0]["schemaweek"];
            if (strlen($schemaweek) != 0) {
                $rows = self::jsonToArray($schemaweek);
                self::_setRows($rows);
                return self::getResultToJson();
            }
        }

        // Obter novo
        $sql = "
            select
                cu.id as contractorunitid,
                p.shortname as contractorunit,
                st.shift,
                cu.position as rownumber,
                substring(getEnum('subunit',csu.subunit),1,1) as subunit,
                sum(coalesce(ads.amountmon,0)) as mon,
                sum(coalesce(ads.amounttue,0)) as tue,
                sum(coalesce(ads.amountwed,0)) as wed,
                sum(coalesce(ads.amountthu,0)) as thu,
                sum(coalesce(ads.amountfri,0)) as fri,
                sum(coalesce(ads.amountsat,0)) as sat,
                sum(coalesce(ads.amountsun,0)) as sun,
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as mondescription,
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as tuedescription,
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as weddescription,
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as thudescription,
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as fridescription,
                case st.shift when 'D' then getEnum('allocationschema','011') when 'N' then getEnum('allocationschema','011') end as satdescription,
                case st.shift when 'D' then getEnum('allocationschema','011') when 'N' then getEnum('allocationschema','011') end as sundescription,
                greatest(sum(coalesce(ads.amountmon,0)),sum(coalesce(ads.amounttue,0)),sum(coalesce(ads.amountwed,0)),sum(coalesce(ads.amountthu,0)),sum(coalesce(ads.amountfri,0)),sum(coalesce(ads.amountsat,0)),sum(coalesce(ads.amountsun,0))) as greatest
            from
                contractorunit cu
                inner join person p on ( p.id = cu.id )
                inner join contractorsubunit csu on ( csu.contractorunitid = cu.id )
                inner join additiveshift ads on ( ads.contractorsubunitid = csu.id )
                inner join shifttype st on ( st.id = ads.shifttypeid )
                inner join additive a on ( a.id = ads.additiveid and a.additivestatus = 'A' )
            group by
                cu.id,
                p.shortname,
                cu.position,
                st.shift,
                csu.subunit
            order by cu.position, cu.id, st.shift, csu.subunit";

        $i = 0;

        try {
            $rows = self::encodeUTF8($proxy->query($sql)->fetchAll());

            $i++;

            // Construindo a Lista de Unidades
            foreach ($rows as $record) {
                $rownumber = 1;
                $greatest = $record["greatest"];

                $mon = intval($record['mon']);
                $tue = intval($record['tue']);
                $wed = intval($record['wed']);
                $thu = intval($record['thu']);
                $fri = intval($record['fri']);
                $sat = intval($record['sat']);
                $sun = intval($record['sun']);

                while ($rownumber <= $greatest) {

                    $record['id'] = $i;
                    $record['position'] = $rownumber;

                    $record['mondescription'] = ($mon >= $rownumber) ? $record['mondescription'] : '...';
                    $record['tuedescription'] = ($tue >= $rownumber) ? $record['tuedescription'] : '...';
                    $record['weddescription'] = ($wed >= $rownumber) ? $record['weddescription'] : '...';
                    $record['thudescription'] = ($thu >= $rownumber) ? $record['thudescription'] : '...';
                    $record['fridescription'] = ($fri >= $rownumber) ? $record['fridescription'] : '...';
                    $record['satdescription'] = ($sat >= $rownumber) ? $record['satdescription'] : '...';
                    $record['sundescription'] = ($sun >= $rownumber) ? $record['sundescription'] : '...';

                    $record['mon'] = ($mon >= $rownumber) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['tue'] = ($tue >= $rownumber) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['wed'] = ($wed >= $rownumber) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['thu'] = ($thu >= $rownumber) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['fri'] = ($fri >= $rownumber) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['sat'] = ($sat >= $rownumber) ? ($record['shift'] == 'D' ? '011' : '011') : '000';
                    $record['sun'] = ($sun >= $rownumber) ? ($record['shift'] == 'D' ? '011' : '011') : '000';

                    $crsContractorUnit[] = $record;

                    $i++;
                    $rownumber++;
                }
            }

            self::_setRows($crsContractorUnit);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}