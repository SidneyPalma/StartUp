<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"allocationschema", "cache":"\\AppAnest\\Cache\\allocationschema", "event":"\\AppAnest\\Event\\allocationschema"}
 */
class allocationschema extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $periodid;

    /**
     * @Policy {"nullable":true, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $username;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $schemaweek;

    /**
     * @Policy {"nullable":true, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $description;

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
     * @return \AppAnest\Model\allocationschema
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getPeriodid() {
        return $this->periodid;
    }

    /**
     * @param type $periodid
     * @return \AppAnest\Model\allocationschema
     */
    public function setPeriodid($periodid) {
        $this->periodid = $periodid;
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
     * @return \AppAnest\Model\allocationschema
     */
    public function setUsername($username) {
        $this->username = $username;
        return $this;
    }

    /**
     * @return type string
     */
    public function getSchemaweek() {
        return $this->schemaweek;
    }

    /**
     * @param type $schemaweek
     * @return \AppAnest\Model\allocationschema
     */
    public function setSchemaweek($schemaweek) {
        $this->schemaweek = $schemaweek;
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
     * @return \AppAnest\Model\allocationschema
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
     * @return \AppAnest\Model\allocationschema
     */
    public function setObservation($observation) {
        $this->observation = $observation;
        return $this;
    }

}