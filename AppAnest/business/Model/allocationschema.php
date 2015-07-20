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
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $username;

    /**
     * @Policy {"nullable":false, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $schema;

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
    public function getSchema() {
        return $this->schema;
    }

    /**
     * @param type $schema
     * @return \AppAnest\Model\allocationschema
     */
    public function setSchema($schema) {
        $this->schema = $schema;
        return $this;
    }

}