<?php

namespace AppAnest\Cache;

use AppAnest\Model\contractorunit as Model;

class contractorunit extends \Smart\Data\Cache {

    public function selectList(array $data) {
        $weekday = 'amount' . $data['weekday'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                cu.id,
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

    public function selectLike(array $data) {
        $p = $f = array();
        $query = $data['query'];
        $start = $data['start'];
        $limit = $data['limit'];
        $params = json_decode($data['params']);
        $proxy = $this->getStore()->getProxy();
        $notate = $this->getStore()->getModel()->getNotate();
        $fields = (isset($data['fields']) && count(json_decode($data['fields'])) !== 0) ? json_decode($data['fields']) : self::objectToArray($notate->property);

        // set fields
        foreach ($fields as $key => $value) {
            $f[] = $value;
        }

        // set params
        foreach ($params as $key => $value) {
            $p[] = "$value LIKE :$value";
        }

        $sql = "SELECT " .implode(',', $f). " FROM person WHERE typeperson = 'U' and ( " . implode(' OR ', $p) . " ) order by name";

        try {

            $query = '%' . $query . '%';

            $pdo = $proxy->prepare($sql);

            foreach ($params as $key => $value) {
                $pdo->bindValue(":$value", $query, \PDO::PARAM_STR);
            }

            $pdo->execute();
            $rows = $pdo->fetchAll();

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
            SELECT
                p.*,
                c.*,
                m.name as parentname,
                getEnum('addressfederationunit', p.addressfederationunit) as addressfederationunitdescription
            FROM
                person p
                inner join person m on ( m.id = p.parentid )
                inner join contractorunit c on ( c.id = p.id )
            WHERE c.id = :id";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":id", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }
	
    public function selectCodePerson(array $data) {
        $query = $data['query'];
        $proxy = $this->getStore()->getProxy();

        $sql = "
            SELECT
                p.id,
                p.shortname
            FROM
                person p
            WHERE p.parentid = :parentid
              and p.typeperson = 'U'";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":parentid", $query, \PDO::PARAM_INT);

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