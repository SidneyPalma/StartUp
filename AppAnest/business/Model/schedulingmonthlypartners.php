<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"schedulingmonthlypartners", "cache":"\\AppAnest\\Cache\\schedulingmonthlypartners", "event":"\\AppAnest\\Event\\schedulingmonthlypartners"}
 */
class schedulingmonthlypartners extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $schedulingmonthlyid;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $naturalpersonid;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $position;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shift;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $subunit;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $allocationschema;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $releasetype;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $username;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $observation;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getSchedulingmonthlyid() {
        return $this->schedulingmonthlyid;
    }

    /**
     * @param type $schedulingmonthlyid
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setSchedulingmonthlyid($schedulingmonthlyid) {
        $this->schedulingmonthlyid = $schedulingmonthlyid;
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
     * @return \AppAnest\Model\schedulingmonthlypartners
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
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setPosition($position) {
        $this->position = $position;
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
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setShift($shift) {
        $this->shift = $shift;
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
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setSubunit($subunit) {
        $this->subunit = $subunit;
        return $this;
    }

    /**
     * @return type string
     */
    public function getAllocationschema() {
        return $this->allocationschema;
    }

    /**
     * @param type $allocationschema
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setAllocationschema($allocationschema) {
        $this->allocationschema = $allocationschema;
        return $this;
    }

    /**
     * @return type string
     */
    public function getReleasetype() {
        return $this->releasetype;
    }

    /**
     * @param type $releasetype
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setReleasetype($releasetype) {
        $this->releasetype = $releasetype;
        return $this;
    }

    /**
     * @return type string
     */
    public function getUsername() {
        return $this->username;
    }

    /**
     * @param type $username
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setUsername($username) {
        $this->username = $username;
        return $this;
    }

    /**
     * @return type string
     */
    public function getObservation() {
        return $this->observation;
    }

    /**
     * @param type $observation
     * @return \AppAnest\Model\schedulingmonthlypartners
     */
    public function setObservation($observation) {
        $this->observation = $observation;
        return $this;
    }

}