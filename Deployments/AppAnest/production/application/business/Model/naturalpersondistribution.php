<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"naturalpersondistribution", "cache":"\\AppAnest\\Cache\\naturalpersondistribution", "event":"\\AppAnest\\Event\\naturalpersondistribution"}
 */
class naturalpersondistribution extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $naturalpersonid;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $contractorunitid;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $weekday;

    /**
     * @Policy {"nullable":false, "length":1}
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
     * @return \AppAnest\Model\naturalpersondistribution
     */
    public function setId($id) {
        $this->id = $id;
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
     * @return \AppAnest\Model\naturalpersondistribution
     */
    public function setNaturalpersonid($naturalpersonid) {
        $this->naturalpersonid = $naturalpersonid;
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
     * @return \AppAnest\Model\naturalpersondistribution
     */
    public function setContractorunitid($contractorunitid) {
        $this->contractorunitid = $contractorunitid;
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
     * @return \AppAnest\Model\naturalpersondistribution
     */
    public function setWeekday($weekday) {
        $this->weekday = $weekday;
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
     * @return \AppAnest\Model\naturalpersondistribution
     */
    public function setShift($shift) {
        $this->shift = $shift;
        return $this;
    }

}