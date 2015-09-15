<?php

namespace AppAnest\Cache;

use AppAnest\Model\tmp_turningmonthly as Model;
use Smart\Utils\Session;

class tmp_turningmonthly extends \Smart\Data\Cache {

    public function updateNaruralPerson (array $data)  {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $pdo = $proxy->prepare("update tmp_turningmonthly set naturalpersonid = null where id = :id");

        $pdo->bindValue(":id", $query, \PDO::PARAM_INT);

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
                    sm.id,
                    sm.schedulingperiodid,
                    sm.contractorunitid,
                    sm.dutydate,
                    sm.shift,
                    smp.id,
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
                    tmp_turningmonthly smp
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

}