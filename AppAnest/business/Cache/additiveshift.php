<?php

namespace AppAnest\Cache;

use AppAnest\Model\additiveshift as Model;

class additiveshift extends \Smart\Data\Cache {

    public function selectChart(array $data) {
        $weekday = "amount" . $data["weekdaydescription"];
        $i_cutecost = $data["positioncute"];
        $crsContractorUnit = array();
        $tmpTurningMonthly = array();
        $turningHorizontal = array();

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                cu.position,
                cu.id as contractorunitid,
                p.shortname as contractorunit,
                sum(coalesce(ads.$weekday,0)) as dutyamount
            from
                contractorunit cu
                left join person p on ( p.id = cu.id )
                inner join contractorsubunit csu on ( csu.contractorunitid = cu.id )
                inner join additiveshift ads on ( ads.contractorsubunitid = csu.id )
                inner join shifttype st on ( st.id = ads.shifttypeid and st.shift = 'N' )
            where coalesce(cu.position,0) != 0
            group by
                cu.id,
                p.shortname,
                cu.position
            order by cu.position";

        $rows = self::encodeUTF8($proxy->query($sql)->fetchAll());

        // Construindo a Lista de Unidades
        foreach ($rows as $record) {
            $rownumber = 1;
            $dutyamount = $record["dutyamount"];
            while ($rownumber <= $dutyamount) {
                $crsContractorUnit[] = $record;
                $rownumber++;
            }
        }

        $week = 1;

        $id = 0;
        $i_position = 1;
        $loopnumber = 1;
        $weeknumber = count($crsContractorUnit);

        // para cada Coluna = $week
        while ($week <= $weeknumber) {

            // obtem as unidades
            foreach ($crsContractorUnit as $record) {
                $position = intval($record["position"]);
                $contractorunit = $record["contractorunit"];
                $contractorunitid = intval($record["contractorunitid"]);

                $tmpTurningMonthly[$loopnumber]["id"] = $id;
                $tmpTurningMonthly[$loopnumber]["position"] = $position;
                $tmpTurningMonthly[$loopnumber]["contractorunit"] = $contractorunit;
                $tmpTurningMonthly[$loopnumber]["contractorunitid"] = $contractorunitid;
                $tmpTurningMonthly[$loopnumber]["week" . str_pad($week,2,"0",STR_PAD_LEFT)] = $i_position;

                $id++;
                $loopnumber++;
                $i_position++;

                if($i_position > $weeknumber)  {
                    $i_position = 1;
                }
            }

            $week++;

            if ($week != 1) {
                $i_position = $tmpTurningMonthly[intval($i_cutecost)]["week" . str_pad($week-1,2,"0",STR_PAD_LEFT)];
            }

            $loopnumber = 1;
        }

        foreach ($tmpTurningMonthly as $record=>$fields) {
            $turningHorizontal[] = $fields;
        }

        self::_setRows($turningHorizontal);

        return self::getResultToJson();

    }

    public function selectList(array $data) {
        $weekday = 'amount' . $data['weekday'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                cu.id as contractorunitid,
                p.shortname as contractorunit,
                cu.position,
                sum(coalesce(ads.$weekday,0)) as dutyamount
            from
                contractorunit cu
                left join person p on ( p.id = cu.id )
                inner join contractorsubunit csu on ( csu.contractorunitid = cu.id )
                inner join additiveshift ads on ( ads.contractorsubunitid = csu.id )
                inner join shifttype st on ( st.id = ads.shifttypeid and st.shift = 'N' )
            where coalesce(cu.position,0) != 0
            group by
                cu.id,
                p.shortname,
                cu.position
            order by cu.position";

        try {
            $rows = $proxy->query($sql)->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectCode(array $data) {
        $additiveid = $data['additiveid'];
        $contractorsubunitid = $data['contractorsubunitid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                a.id,
                getEnum('shift',t.shift) as shiftdescription,
                getEnum('dutytype',t.dutytype) as dutytypedescription,
                t.shift,
                t.dutytype,
                t.hours,
                t.validityof,
                t.validityto,
                :additiveid as additiveid,
                :contractorsubunitid as contractorsubunitid,
                t.id as shifttypeid,
                a.amountsun,
                a.amountmon,
                a.amounttue,
                a.amountwed,
                a.amountthu,
                a.amountfri,
                a.amountsat,
                case coalesce(a.id,0) when 0 then 0 else 1 end as isactive
            from
                shifttype t
                left join additiveshift a on ( a.shifttypeid = t.id and a.additiveid = :additiveid and a.contractorsubunitid = :contractorsubunitid )
            order by t.id";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":additiveid", $additiveid, \PDO::PARAM_INT);
            $pdo->bindValue(":contractorsubunitid", $contractorsubunitid, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectTree(array $data) {
        $showfilter = $data['showfilter'];
        $contractid = $data['contractid'];
        $additiveid = $data['additiveid'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                c.contractnumber as id,
                null as parentid,
                concat(substring(c.contractnumber, 1,3),'/',substring(c.contractnumber, 4,4),'-',a.additivenumber) as text,
                'icon-doc-text' as glyph,
                (
                    select
                        coalesce(cast(sum(
                            (coalesce(af.amountsun,0)*(s.hours/12)) + (coalesce(af.amountmon,0)*(s.hours/12)) +
                            (coalesce(af.amounttue,0)*(s.hours/12)) + (coalesce(af.amountwed,0)*(s.hours/12)) +
                            (coalesce(af.amountthu,0)*(s.hours/12)) + (coalesce(af.amountfri,0)*(s.hours/12)) + (coalesce(af.amountsat,0)*(s.hours/12))
                        ) as decimal(18,2)),0) as total
                    from
                        additiveshift af,
                        contractorsubunit csu,
                        shifttype s
                    where af.additiveid = a.id
                      and s.id = af.shifttypeid
                      and af.contractorsubunitid = csu.id
                      and ((af.amountsun != 0)or(af.amountmon != 0)or(af.amounttue !=0)or(af.amountwed != 0)or(af.amountthu != 0)or(af.amountfri != 0)or(af.amountsat != 0))
                ) as released,
                0 as leaf,
                a.id as additiveid
            from
                contract c
                inner join additive a on ( a.contractid = c.id )
                inner join person p on ( p.id = c.contractorid )
            where c.id = :contractid
              and a.id = :additiveid

            union all

            select
                p.id,
                c.contractnumber as parentid,
                p.shortname as text,
                'icon-certificate-outline' as glyph,
                (
                    select
                        coalesce(cast(sum(
                            (coalesce(af.amountsun,0)*(s.hours/12)) + (coalesce(af.amountmon,0)*(s.hours/12)) +
                            (coalesce(af.amounttue,0)*(s.hours/12)) + (coalesce(af.amountwed,0)*(s.hours/12)) +
                            (coalesce(af.amountthu,0)*(s.hours/12)) + (coalesce(af.amountfri,0)*(s.hours/12)) + (coalesce(af.amountsat,0)*(s.hours/12))
                        ) as decimal(18,2)),0) as total
                    from
                        additiveshift af,
                        contractorsubunit csu,
                        shifttype s
                    where af.additiveid = a.id
                      and s.id = af.shifttypeid
                      and af.contractorsubunitid = csu.id
                      and csu.contractorunitid = p.id
                      and ((af.amountsun != 0)or(af.amountmon != 0)or(af.amounttue !=0)or(af.amountwed != 0)or(af.amountthu != 0)or(af.amountfri != 0)or(af.amountsat != 0))
                ) as released,
                1 as leaf,
                a.id as additiveid
            from
                contract c
                inner join additive a on ( a.contractid = c.id )
                inner join person p on ( p.parentid = c.contractorid )
            where c.id = :contractid
              and a.id = :additiveid

            order by 3, 2, 1";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":contractid", $contractid, \PDO::PARAM_INT);
            $pdo->bindValue(":additiveid", $additiveid, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            if($showfilter != '1') {
                $data = array();

                foreach ($rows as $record => $fields) {
                    $leaf = intval($fields['leaf']);
                    $released = floatval($fields['released']);

                    if ($showfilter == '2') {
                        if (($leaf == 0) || ($leaf == 1 && $released != 0.00)) {
                            $data[] = $fields;
                        }
                    }

                    if ($showfilter == '3') {
                        if (($leaf == 0) || ($leaf == 1 && $released == 0.00)) {
                            $data[] = $fields;
                        }
                    }

                }

                $rows = $data;
            }

            $root = self::buildTree($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
            return self::getResultToJson();
        }

        return self::arrayToJson($root[0]);
    }

    public function updateView(array $data) {
        $contractid = $data['contractid'];
        $additiveid = $data['additiveid'];
        $contractorunitid = $data['contractorunitid'];
        $contractorsubunitid = $data['contractorsubunitid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                c.contractnumber,
                coalesce(cast(sum(
                    (coalesce(af.amountsun,0)*(s.hours/12)) + (coalesce(af.amountmon,0)*(s.hours/12)) +
                    (coalesce(af.amounttue,0)*(s.hours/12)) + (coalesce(af.amountwed,0)*(s.hours/12)) +
                    (coalesce(af.amountthu,0)*(s.hours/12)) + (coalesce(af.amountfri,0)*(s.hours/12)) + (coalesce(af.amountsat,0)*(s.hours/12))
                ) as decimal(18,2)),0) as totalreleased,
                (
                    select
                        coalesce(cast(sum(
                            (coalesce(af_.amountsun,0)*(s_.hours/12)) + (coalesce(af_.amountmon,0)*(s_.hours/12)) +
                            (coalesce(af_.amounttue,0)*(s_.hours/12)) + (coalesce(af_.amountwed,0)*(s_.hours/12)) +
                            (coalesce(af_.amountthu,0)*(s_.hours/12)) + (coalesce(af_.amountfri,0)*(s_.hours/12)) + (coalesce(af_.amountsat,0)*(s_.hours/12))
                        ) as decimal(18,2)),0) as total

                    from
                        enumtype et_
                        inner join enumtypelist etl_ on ( etl_.enumtypeid = et_.id )
                        inner join contractorsubunit csu_ on ( csu_.subunit = etl_.code and csu_.contractorunitid = :contractorunitid and csu_.id = :contractorsubunitid )
                        inner join additiveshift af_ on ( af_.additiveid = :additiveid and af_.contractorsubunitid = csu_.id
                              and ((af_.amountsun != 0)or(af_.amountmon != 0)or(af_.amounttue !=0)or(af_.amountwed != 0)or(af_.amountthu != 0)or(af_.amountfri != 0)or(af_.amountsat != 0)) )
                        inner join shifttype s_ on ( s_.id = af_.shifttypeid )
                    where et_.name = 'subunit'
                      and csu_.id != 0
                ) as totaladditiveshift
            from
                contract c
                inner join additive a on ( a.contractid = c.id )
                inner join additiveshift af on ( af.additiveid = a.id and ((af.amountsun != 0)or(af.amountmon != 0)or(af.amounttue !=0)or(af.amountwed != 0)or(af.amountthu != 0)or(af.amountfri != 0)or(af.amountsat != 0)) )
                inner join contractorsubunit csu on ( csu.id = af.contractorsubunitid )
                inner join shifttype s on ( s.id = af.shifttypeid )
            where c.id = :contractid
              and a.id = :additiveid";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":contractid", $contractid, \PDO::PARAM_INT);
            $pdo->bindValue(":additiveid", $additiveid, \PDO::PARAM_INT);
            $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);
            $pdo->bindValue(":contractorsubunitid", $contractorsubunitid, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

}