<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"contract", "cache":"\\AppAnest\\Cache\\contract", "event":"\\AppAnest\\Event\\contract"}
 */
class contract extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"AUTO", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false, "length":7}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $contractnumber;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $legalentityid;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $contractorid;

    /**
     * @Policy {"nullable":true, "length":4294967295}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $filedata;

    /**
     * @Policy {"nullable":true, "length":65535}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $fileinfo;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $contractdate;

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
     * @return \AppAnest\Model\contract
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type string
     */
    public function getContractnumber() {
        return $this->contractnumber;
    }

    /**
     * @param type $contractnumber
     * @return \AppAnest\Model\contract
     */
    public function setContractnumber($contractnumber) {
        $this->contractnumber = $contractnumber;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getLegalentityid() {
        return $this->legalentityid;
    }

    /**
     * @param type $legalentityid
     * @return \AppAnest\Model\contract
     */
    public function setLegalentityid($legalentityid) {
        $this->legalentityid = $legalentityid;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getContractorid() {
        return $this->contractorid;
    }

    /**
     * @param type $contractorid
     * @return \AppAnest\Model\contract
     */
    public function setContractorid($contractorid) {
        $this->contractorid = $contractorid;
        return $this;
    }

    /**
     * @return type string
     */
    public function getFiledata() {
        return $this->filedata;
    }

    /**
     * @param type $filedata
     * @return \AppAnest\Model\contract
     */
    public function setFiledata($filedata) {
        $this->filedata = $filedata;
        return $this;
    }

    /**
     * @return type string
     */
    public function getFileinfo() {
        return $this->fileinfo;
    }

    /**
     * @param type $fileinfo
     * @return \AppAnest\Model\contract
     */
    public function setFileinfo($fileinfo) {
        $this->fileinfo = $fileinfo;
        return $this;
    }

    /**
     * @return type date
     */
    public function getContractdate() {
        return $this->contractdate;
    }

    /**
     * @param type $contractdate
     * @return \AppAnest\Model\contract
     */
    public function setContractdate($contractdate) {
        $this->contractdate = $contractdate;
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
     * @return \AppAnest\Model\contract
     */
    public function setIsactive($isactive) {
        $this->isactive = $isactive;
        return $this;
    }

}