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
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $positioncute;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $weekday;

    /**
     * @Policy {"nullable":false, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $map;

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
     * @return type integer
     */
    public function getPositioncute() {
        return $this->positioncute;
    }

    /**
     * @param type $positioncute
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setPositioncute($positioncute) {
        $this->positioncute = $positioncute;
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
    public function getMap() {
        return $this->map;
    }

    /**
     * @param type $map
     * @return \AppAnest\Model\allocationschemamap
     */
    public function setMap($map) {
        $this->map = $map;
        return $this;
    }

}