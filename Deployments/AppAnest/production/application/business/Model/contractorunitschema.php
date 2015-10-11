<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"contractorunitschema", "cache":"\\AppAnest\\Cache\\contractorunitschema", "event":"\\AppAnest\\Event\\contractorunitschema"}
 */
class contractorunitschema extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $contractorsubunitid;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $schedulingperiodid;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $naturalpersonid;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $position;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $weekday;

    /**
     * @Policy {"nullable":true, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $allocationtype;

    /**
     * @Policy {"nullable":true, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shift;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getContractorsubunitid() {
        return $this->contractorsubunitid;
    }

    /**
     * @param type $contractorsubunitid
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setContractorsubunitid($contractorsubunitid) {
        $this->contractorsubunitid = $contractorsubunitid;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getSchedulingperiodid() {
        return $this->schedulingperiodid;
    }

    /**
     * @param type $schedulingperiodid
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setSchedulingperiodid($schedulingperiodid) {
        $this->schedulingperiodid = $schedulingperiodid;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getNaturalpersonid() {
        return $this->naturalpersonid;
    }

    /**
     * @param type $naturalpersonid
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setNaturalpersonid($naturalpersonid) {
        $this->naturalpersonid = $naturalpersonid;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getPosition() {
        return $this->position;
    }

    /**
     * @param type $position
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setPosition($position) {
        $this->position = $position;
        return $this;
    }

    /**
     * @return type string
     */
    public function getWeekday() {
        return $this->weekday;
    }

    /**
     * @param type $weekday
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setWeekday($weekday) {
        $this->weekday = $weekday;
        return $this;
    }

    /**
     * @return type string
     */
    public function getAllocationtype() {
        return $this->allocationtype;
    }

    /**
     * @param type $allocationtype
     * @return \AppAnest\Model\contractorunitschema
     */
    public function setAllocationtype($allocationtype) {
        $this->allocationtype = $allocationtype;
        return $this;
    }
//

    /**
     * @return type string
     */
    public function getShift() {
        return $this->shift;
    }

    /**
     * @param type $shift
     * @return \AppAnest\Model\shift
     */
    public function setShift($shift) {
        $this->shift = $shift;
        return $this;
    }
}