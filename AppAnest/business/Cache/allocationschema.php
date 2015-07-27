<?php

namespace AppAnest\Cache;

use AppAnest\Model\allocationschema as Model;

class allocationschema extends \Smart\Data\Cache {

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
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as satdescription,
                case st.shift when 'D' then getEnum('allocationschema','001') when 'N' then getEnum('allocationschema','002') end as sundescription,
                greatest(sum(coalesce(ads.amountmon,0)),sum(coalesce(ads.amounttue,0)),sum(coalesce(ads.amountwed,0)),sum(coalesce(ads.amountthu,0)),sum(coalesce(ads.amountfri,0)),sum(coalesce(ads.amountsat,0)),sum(coalesce(ads.amountsun,0))) as greatest
            from
                contractorunit cu
                inner join person p on ( p.id = cu.id )
                inner join contractorsubunit csu on ( csu.contractorunitid = cu.id )
                inner join additiveshift ads on ( ads.contractorsubunitid = csu.id )
                inner join shifttype st on ( st.id = ads.shifttypeid )
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
                while ($rownumber <= $greatest) {

                    $record['id'] = $i;
                    $record['position'] = $rownumber;

                    $record['mondescription'] = (intval($record['mon']) != 0) ? $record['mondescription'] : '';
                    $record['tuedescription'] = (intval($record['tue']) != 0) ? $record['tuedescription'] : '';
                    $record['weddescription'] = (intval($record['wed']) != 0) ? $record['weddescription'] : '';
                    $record['thudescription'] = (intval($record['thu']) != 0) ? $record['thudescription'] : '';
                    $record['fridescription'] = (intval($record['fri']) != 0) ? $record['fridescription'] : '';
                    $record['satdescription'] = (intval($record['sat']) != 0) ? $record['satdescription'] : '';
                    $record['sundescription'] = (intval($record['sun']) != 0) ? $record['sundescription'] : '';

                    $record['mon'] = (intval($record['mon']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['tue'] = (intval($record['tue']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['wed'] = (intval($record['wed']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['thu'] = (intval($record['thu']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['fri'] = (intval($record['fri']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['sat'] = (intval($record['sat']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';
                    $record['sun'] = (intval($record['sun']) != 0) ? ($record['shift'] == 'D' ? '001' : '002') : '000';

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