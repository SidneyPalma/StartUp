<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"period", "cache":"\\AppAnest\\Cache\\period", "event":"\\AppAnest\\Event\\period"}
 */
class period extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $year;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $month;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\period
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getYear() {
        return $this->year;
    }

    /**
     * @param type $year
     * @return \AppAnest\Model\period
     */
    public function setYear($year) {
        $this->year = $year;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getMonth() {
        return $this->month;
    }

    /**
     * @param type $month
     * @return \AppAnest\Model\period
     */
    public function setMonth($month) {
        $this->month = $month;
        return $this;
    }

}