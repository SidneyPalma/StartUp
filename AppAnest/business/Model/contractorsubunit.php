<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"contractorsubunit", "cache":"\\AppAnest\\Cache\\contractorsubunit", "event":"\\AppAnest\\Event\\contractorsubunit"}
 */
class contractorsubunit extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $contractorunitid;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $subunit;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $reserved;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getContractorunitid() {
        return $this->contractorunitid;
    }

    /**
     * @param type $contractorunitid
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setContractorunitid($contractorunitid) {
        $this->contractorunitid = $contractorunitid;
        return $this;
    }

    /**
     * @return type string
     */
    public function getSubunit() {
        return $this->subunit;
    }

    /**
     * @param type $subunit
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setSubunit($subunit) {
        $this->subunit = $subunit;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getReserved() {
        return $this->reserved;
    }

    /**
     * @param type $reserved
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setReserved($reserved) {
        $this->reserved = $reserved;
        return $this;
    }

}