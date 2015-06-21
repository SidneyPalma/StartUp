<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"contractorsubunit", "cache":"\\AppAnest\\Cache\\contractorsubunit", "event":"\\AppAnest\\Event\\contractorsubunit"}
 */
class contractorsubunit extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $contractorunit;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $subunit;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $observation;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $isactive;

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
    public function getContractorunit() {
        return $this->contractorunit;
    }

    /**
     * @param type $contractorunit
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setContractorunit($contractorunit) {
        $this->contractorunit = $contractorunit;
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
     * @return type string
     */
    public function getObservation() {
        return $this->observation;
    }

    /**
     * @param type $observation
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setObservation($observation) {
        $this->observation = $observation;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getIsactive() {
        return $this->isactive;
    }

    /**
     * @param type $isactive
     * @return \AppAnest\Model\contractorsubunit
     */
    public function setIsactive($isactive) {
        $this->isactive = $isactive;
        return $this;
    }

}