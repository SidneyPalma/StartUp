<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"holiday", "cache":"\\AppAnest\\Cache\\holiday", "event":"\\AppAnest\\Event\\holiday"}
 */
class holiday extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $description;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $holidaytype;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $holidaydate;

    /**
     * @Policy {"nullable":true}
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
     * @return \AppAnest\Model\holiday
     */
    public function setId($id) {
        $this->id = $id;
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
     * @return \AppAnest\Model\holiday
     */
    public function setDescription($description) {
        $this->description = $description;
        return $this;
    }

    /**
     * @return type string
     */
    public function getHolidaytype() {
        return $this->holidaytype;
    }

    /**
     * @param type $holidaytype
     * @return \AppAnest\Model\holiday
     */
    public function setHolidaytype($holidaytype) {
        $this->holidaytype = $holidaytype;
        return $this;
    }

    /**
     * @return type date
     */
    public function getHolidaydate() {
        return $this->holidaydate;
    }

    /**
     * @param type $holidaydate
     * @return \AppAnest\Model\holiday
     */
    public function setHolidaydate($holidaydate) {
        $this->holidaydate = $holidaydate;
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
     * @return \AppAnest\Model\holiday
     */
    public function setIsactive($isactive) {
        $this->isactive = $isactive;
        return $this;
    }

}