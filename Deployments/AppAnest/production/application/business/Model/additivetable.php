<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"additivetable", "cache":"\\AppAnest\\Cache\\additivetable", "event":"\\AppAnest\\Event\\additivetable"}
 */
class additivetable extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $additiveid;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shifttype;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shiftvalue;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $shiftamount;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\additivetable
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getAdditiveid() {
        return $this->additiveid;
    }

    /**
     * @param type $additiveid
     * @return \AppAnest\Model\additivetable
     */
    public function setAdditiveid($additiveid) {
        $this->additiveid = $additiveid;
        return $this;
    }

    /**
     * @return type string
     */
    public function getShifttype() {
        return $this->shifttype;
    }

    /**
     * @param type $shifttype
     * @return \AppAnest\Model\additivetable
     */
    public function setShifttype($shifttype) {
        $this->shifttype = $shifttype;
        return $this;
    }

    /**
     * @return type string
     */
    public function getShiftvalue() {
        return $this->shiftvalue;
    }

    /**
     * @param type $shiftvalue
     * @return \AppAnest\Model\additivetable
     */
    public function setShiftvalue($shiftvalue) {
        $this->shiftvalue = $shiftvalue;
        return $this;
    }

    /**
     * @return type string
     */
    public function getShiftamount() {
        return $this->shiftamount;
    }

    /**
     * @param type $shiftamount
     * @return \AppAnest\Model\additivetable
     */
    public function setShiftamount($shiftamount) {
        $this->shiftamount = $shiftamount;
        return $this;
    }

}