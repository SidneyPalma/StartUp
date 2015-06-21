<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"enumtypelist", "cache":"\\AppAnest\\Cache\\enumtypelist", "event":"\\AppAnest\\Event\\enumtypelist"}
 */
class enumtypelist extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":false}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $enumtypeid;

    /**
     * @Policy {"nullable":false, "length":5}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $code;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $description;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":false}
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
     * @return \AppAnest\Model\enumtypelist
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getEnumtypeid() {
        return $this->enumtypeid;
    }

    /**
     * @param type $enumtypeid
     * @return \AppAnest\Model\enumtypelist
     */
    public function setEnumtypeid($enumtypeid) {
        $this->enumtypeid = $enumtypeid;
        return $this;
    }

    /**
     * @return type string
     */
    public function getCode() {
        return $this->code;
    }

    /**
     * @param type $code
     * @return \AppAnest\Model\enumtypelist
     */
    public function setCode($code) {
        $this->code = $code;
        return $this;
    }

    /**
     * @return type string
     */
    public function getDescription() {
        return $this->description;
    }

    /**
     * @param type $description
     * @return \AppAnest\Model\enumtypelist
     */
    public function setDescription($description) {
        $this->description = $description;
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
     * @return \AppAnest\Model\enumtypelist
     */
    public function setObservation($observation) {
        $this->observation = $observation;
        return $this;
    }

}