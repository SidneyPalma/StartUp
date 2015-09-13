<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"schedulingperiod", "cache":"\\AppAnest\\Cache\\schedulingperiod", "event":"\\AppAnest\\Event\\schedulingperiod"}
 */
class schedulingperiod extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $year;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $month;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $periodof;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $periodto;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $status;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\schedulingperiod
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
     * @return \AppAnest\Model\schedulingperiod
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
     * @return \AppAnest\Model\schedulingperiod
     */
    public function setMonth($month) {
        $this->month = $month;
        return $this;
    }

    /**
     * @return type date
     */
    public function getPeriodof() {
        return $this->periodof;
    }

    /**
     * @param type $periodof
     * @return \AppAnest\Model\schedulingperiod
     */
    public function setPeriodof($periodof) {
        $this->periodof = $periodof;
        return $this;
    }

    /**
     * @return type date
     */
    public function getPeriodto() {
        return $this->periodto;
    }

    /**
     * @param type $periodto
     * @return \AppAnest\Model\schedulingperiod
     */
    public function setPeriodto($periodto) {
        $this->periodto = $periodto;
        return $this;
    }

    /**
     * @return type string
     */
    public function getStatus() {
        return $this->status;
    }

    /**
     * @param type $status
     * @return \AppAnest\Model\schedulingperiod
     */
    public function setStatus($status) {
        $this->status = $status;
        return $this;
    }

}