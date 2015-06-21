<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"enumtype", "cache":"\\AppAnest\\Cache\\enumtype", "event":"\\AppAnest\\Event\\enumtype"}
 */
class enumtype extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false, "length":45}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $name;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $description;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $observation;

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
     * @return \AppAnest\Model\enumtype
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type string
     */
    public function getName() {
        return $this->name;
    }

    /**
     * @param type $name
     * @return \AppAnest\Model\enumtype
     */
    public function setName($name) {
        $this->name = $name;
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
     * @return \AppAnest\Model\enumtype
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
     * @return \AppAnest\Model\enumtype
     */
    public function setObservation($observation) {
        $this->observation = $observation;
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
     * @return \AppAnest\Model\enumtype
     */
    public function setReserved($reserved) {
        $this->reserved = $reserved;
        return $this;
    }

}