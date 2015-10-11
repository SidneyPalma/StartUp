<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"contractorunitreplacement", "cache":"\\AppAnest\\Cache\\contractorunitreplacement", "event":"\\AppAnest\\Event\\contractorunitreplacement"}
 */
class contractorunitreplacement extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $contractorsubunitid;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $schedulingperiodid;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $naturalpersonidof;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $naturalpersonidto;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shift;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $sun;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $mon;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $tue;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $wed;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $thu;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $fri;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $sat;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\contractorunitreplacement
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
     * @return \AppAnest\Model\contractorunitreplacement
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
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setSchedulingperiodid($schedulingperiodid) {
        $this->schedulingperiodid = $schedulingperiodid;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getNaturalpersonidof() {
        return $this->naturalpersonidof;
    }

    /**
     * @param type $naturalpersonidof
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setNaturalpersonidof($naturalpersonidof) {
        $this->naturalpersonidof = $naturalpersonidof;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getNaturalpersonidto() {
        return $this->naturalpersonidto;
    }

    /**
     * @param type $naturalpersonidto
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setNaturalpersonidto($naturalpersonidto) {
        $this->naturalpersonidto = $naturalpersonidto;
        return $this;
    }

    /**
     * @return type string
     */
    public function getShift() {
        return $this->shift;
    }

    /**
     * @param type $shift
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setShift($shift) {
        $this->shift = $shift;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getSun() {
        return $this->sun;
    }

    /**
     * @param type $sun
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setSun($sun) {
        $this->sun = $sun;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getMon() {
        return $this->mon;
    }

    /**
     * @param type $mon
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setMon($mon) {
        $this->mon = $mon;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getTue() {
        return $this->tue;
    }

    /**
     * @param type $tue
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setTue($tue) {
        $this->tue = $tue;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getWed() {
        return $this->wed;
    }

    /**
     * @param type $wed
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setWed($wed) {
        $this->wed = $wed;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getThu() {
        return $this->thu;
    }

    /**
     * @param type $thu
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setThu($thu) {
        $this->thu = $thu;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getFri() {
        return $this->fri;
    }

    /**
     * @param type $fri
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setFri($fri) {
        $this->fri = $fri;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getSat() {
        return $this->sat;
    }

    /**
     * @param type $sat
     * @return \AppAnest\Model\contractorunitreplacement
     */
    public function setSat($sat) {
        $this->sat = $sat;
        return $this;
    }

}