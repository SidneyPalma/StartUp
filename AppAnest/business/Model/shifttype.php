<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"shifttype", "cache":"\\AppAnest\\Cache\\shifttype", "event":"\\AppAnest\\Event\\shifttype"}
 */
class shifttype extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shift;

    /**
     * @Policy {"nullable":true, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $dutytype;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $hours;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"time", "policy":true}
     */
    private $validityof;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"time", "policy":true}
     */
    private $validityto;

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
     * @return \AppAnest\Model\shifttype
     */
    public function setId($id) {
        $this->id = $id;
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
     * @return \AppAnest\Model\shifttype
     */
    public function setShift($shift) {
        $this->shift = $shift;
        return $this;
    }

    /**
     * @return type string
     */
    public function getDutytype() {
        return $this->dutytype;
    }

    /**
     * @param type $dutytype
     * @return \AppAnest\Model\shifttype
     */
    public function setDutytype($dutytype) {
        $this->dutytype = $dutytype;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getHours() {
        return $this->hours;
    }

    /**
     * @param type $hours
     * @return \AppAnest\Model\shifttype
     */
    public function setHours($hours) {
        $this->hours = $hours;
        return $this;
    }

    /**
     * @return type time
     */
    public function getValidityof() {
        return $this->validityof;
    }

    /**
     * @param type $validityof
     * @return \AppAnest\Model\shifttype
     */
    public function setValidityof($validityof) {
        $this->validityof = $validityof;
        return $this;
    }

    /**
     * @return type time
     */
    public function getValidityto() {
        return $this->validityto;
    }

    /**
     * @param type $validityto
     * @return \AppAnest\Model\shifttype
     */
    public function setValidityto($validityto) {
        $this->validityto = $validityto;
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
     * @return \AppAnest\Model\shifttype
     */
    public function setObservation($observation) {
        $this->observation = $observation;
        return $this;
    }

}