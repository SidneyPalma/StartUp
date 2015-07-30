<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"allocationschemamap", "cache":"\\AppAnest\\Cache\\allocationschemamap", "event":"\\AppAnest\\Event\\allocationschemamap"}
 */
class allocationschemamap extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $allocationschemaid;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $weekday;

    /**
     * @Policy {"nullable":false, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $schemamap;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $weekold;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $weeknew;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getAllocationschemaid() {
        return $this->allocationschemaid;
    }

    /**
     * @param type $allocationschemaid
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setAllocationschemaid($allocationschemaid) {
        $this->allocationschemaid = $allocationschemaid;
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
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setWeekday($weekday) {
        $this->weekday = $weekday;
        return $this;
    }

    /**
     * @return type string
     */
    public function getSchemamap() {
        return $this->schemamap;
    }

    /**
     * @param type $schemamap
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setSchemamap($schemamap) {
        $this->schemamap = $schemamap;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getWeekold() {
        return $this->weekold;
    }

    /**
     * @param type $weekold
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setWeekold($weekold) {
        $this->weekold = $weekold;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getWeeknew() {
        return $this->weeknew;
    }

    /**
     * @param type $weeknew
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setWeeknew($weeknew) {
        $this->weeknew = $weeknew;
        return $this;
    }

}