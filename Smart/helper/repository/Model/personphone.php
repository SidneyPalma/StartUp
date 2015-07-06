<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"personphone", "cache":"\\AppAnest\\Cache\\personphone", "event":"\\AppAnest\\Event\\personphone"}
 */
class personphone extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $personid;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $description;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $phonetype;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $linetype;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $ddd;

    /**
     * @Policy {"nullable":false, "length":30}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $phonenumber;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $phoneoperator;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"boolean", "policy":true}
     */
    private $isdefault;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\personphone
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getPersonid() {
        return $this->personid;
    }

    /**
     * @param type $personid
     * @return \AppAnest\Model\personphone
     */
    public function setPersonid($personid) {
        $this->personid = $personid;
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
     * @return \AppAnest\Model\personphone
     */
    public function setDescription($description) {
        $this->description = $description;
        return $this;
    }

    /**
     * @return type string
     */
    public function getPhonetype() {
        return $this->phonetype;
    }

    /**
     * @param type $phonetype
     * @return \AppAnest\Model\personphone
     */
    public function setPhonetype($phonetype) {
        $this->phonetype = $phonetype;
        return $this;
    }

    /**
     * @return type string
     */
    public function getLinetype() {
        return $this->linetype;
    }

    /**
     * @param type $linetype
     * @return \AppAnest\Model\personphone
     */
    public function setLinetype($linetype) {
        $this->linetype = $linetype;
        return $this;
    }

    /**
     * @return type string
     */
    public function getDdd() {
        return $this->ddd;
    }

    /**
     * @param type $ddd
     * @return \AppAnest\Model\personphone
     */
    public function setDdd($ddd) {
        $this->ddd = $ddd;
        return $this;
    }

    /**
     * @return type string
     */
    public function getPhonenumber() {
        return $this->phonenumber;
    }

    /**
     * @param type $phonenumber
     * @return \AppAnest\Model\personphone
     */
    public function setPhonenumber($phonenumber) {
        $this->phonenumber = $phonenumber;
        return $this;
    }

    /**
     * @return type string
     */
    public function getPhoneoperator() {
        return $this->phoneoperator;
    }

    /**
     * @param type $phoneoperator
     * @return \AppAnest\Model\personphone
     */
    public function setPhoneoperator($phoneoperator) {
        $this->phoneoperator = $phoneoperator;
        return $this;
    }

    /**
     * @return type boolean
     */
    public function getIsdefault() {
        return $this->isdefault;
    }

    /**
     * @param type $isdefault
     * @return \AppAnest\Model\personphone
     */
    public function setIsdefault($isdefault) {
        $this->isdefault = $isdefault;
        return $this;
    }

}