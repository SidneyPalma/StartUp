<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"naturalperson", "cache":"\\AppAnest\\Cache\\naturalperson", "event":"\\AppAnest\\Event\\naturalperson"}
 */
class naturalperson extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "strategy":"NONE", "type":"integer", "policy":true}
     */
    private $id;

    /**
     * @Policy {"nullable":false, "length":15}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $sheetcode;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $birthdate;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $gender;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $namemother;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $namefather;

    /**
     * @Policy {"nullable":false, "length":1}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $status;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $nationality;

    /**
     * @Policy {"nullable":false, "length":80}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $placebirth;

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $admissiondate;

    /**
     * @Policy {"nullable":true, "length":20}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $voter;

    /**
     * @Policy {"nullable":true, "length":20}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $voterzone;

    /**
     * @Policy {"nullable":true, "length":20}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $votersection;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $voterissuingdate;

    /**
     * @Policy {"nullable":true, "length":45}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $pispasep;

    /**
     * @Policy {"nullable":true, "length":11}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $cpfnumber;

    /**
     * @Policy {"nullable":true, "length":45}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $identnumber;

    /**
     * @Policy {"nullable":true, "length":45}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $identissuing;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $identissuingdate;

    /**
     * @Policy {"nullable":true, "length":2}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $identissuingstate;

    /**
     * @Policy {"nullable":false, "length":20}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $crmnumber;

    /**
     * @Policy {"nullable":true, "length":2}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $crmissuingstate;

    /**
     * @Policy {"nullable":false, "length":3}
     * @Column {"description":"", "type":"string", "policy":true}
     */
    private $racecolor;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $registrationid;

    /**
     * @Policy {"nullable":true}
     * @Column {"description":"", "type":"date", "policy":true}
     */
    private $associationdate;

    /**
     * @return type integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param type $id
     * @return \AppAnest\Model\naturalperson
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * @return type string
     */
    public function getSheetcode() {
        return $this->sheetcode;
    }

    /**
     * @param type $sheetcode
     * @return \AppAnest\Model\naturalperson
     */
    public function setSheetcode($sheetcode) {
        $this->sheetcode = $sheetcode;
        return $this;
    }

    /**
     * @return type date
     */
    public function getBirthdate() {
        return $this->birthdate;
    }

    /**
     * @param type $birthdate
     * @return \AppAnest\Model\naturalperson
     */
    public function setBirthdate($birthdate) {
        $this->birthdate = $birthdate;
        return $this;
    }

    /**
     * @return type string
     */
    public function getGender() {
        return $this->gender;
    }

    /**
     * @param type $gender
     * @return \AppAnest\Model\naturalperson
     */
    public function setGender($gender) {
        $this->gender = $gender;
        return $this;
    }

    /**
     * @return type string
     */
    public function getNamemother() {
        return $this->namemother;
    }

    /**
     * @param type $namemother
     * @return \AppAnest\Model\naturalperson
     */
    public function setNamemother($namemother) {
        $this->namemother = $namemother;
        return $this;
    }

    /**
     * @return type string
     */
    public function getNamefather() {
        return $this->namefather;
    }

    /**
     * @param type $namefather
     * @return \AppAnest\Model\naturalperson
     */
    public function setNamefather($namefather) {
        $this->namefather = $namefather;
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
     * @return \AppAnest\Model\naturalperson
     */
    public function setStatus($status) {
        $this->status = $status;
        return $this;
    }

    /**
     * @return type string
     */
    public function getNationality() {
        return $this->nationality;
    }

    /**
     * @param type $nationality
     * @return \AppAnest\Model\naturalperson
     */
    public function setNationality($nationality) {
        $this->nationality = $nationality;
        return $this;
    }

    /**
     * @return type string
     */
    public function getPlacebirth() {
        return $this->placebirth;
    }

    /**
     * @param type $placebirth
     * @return \AppAnest\Model\naturalperson
     */
    public function setPlacebirth($placebirth) {
        $this->placebirth = $placebirth;
        return $this;
    }

    /**
     * @return type date
     */
    public function getAdmissiondate() {
        return $this->admissiondate;
    }

    /**
     * @param type $admissiondate
     * @return \AppAnest\Model\naturalperson
     */
    public function setAdmissiondate($admissiondate) {
        $this->admissiondate = $admissiondate;
        return $this;
    }

    /**
     * @return type string
     */
    public function getVoter() {
        return $this->voter;
    }

    /**
     * @param type $voter
     * @return \AppAnest\Model\naturalperson
     */
    public function setVoter($voter) {
        $this->voter = $voter;
        return $this;
    }

    /**
     * @return type string
     */
    public function getVoterzone() {
        return $this->voterzone;
    }

    /**
     * @param type $voterzone
     * @return \AppAnest\Model\naturalperson
     */
    public function setVoterzone($voterzone) {
        $this->voterzone = $voterzone;
        return $this;
    }

    /**
     * @return type string
     */
    public function getVotersection() {
        return $this->votersection;
    }

    /**
     * @param type $votersection
     * @return \AppAnest\Model\naturalperson
     */
    public function setVotersection($votersection) {
        $this->votersection = $votersection;
        return $this;
    }

    /**
     * @return type date
     */
    public function getVoterissuingdate() {
        return $this->voterissuingdate;
    }

    /**
     * @param type $voterissuingdate
     * @return \AppAnest\Model\naturalperson
     */
    public function setVoterissuingdate($voterissuingdate) {
        $this->voterissuingdate = $voterissuingdate;
        return $this;
    }

    /**
     * @return type string
     */
    public function getPispasep() {
        return $this->pispasep;
    }

    /**
     * @param type $pispasep
     * @return \AppAnest\Model\naturalperson
     */
    public function setPispasep($pispasep) {
        $this->pispasep = $pispasep;
        return $this;
    }

    /**
     * @return type string
     */
    public function getCpfnumber() {
        return $this->cpfnumber;
    }

    /**
     * @param type $cpfnumber
     * @return \AppAnest\Model\naturalperson
     */
    public function setCpfnumber($cpfnumber) {
        $this->cpfnumber = $cpfnumber;
        return $this;
    }

    /**
     * @return type string
     */
    public function getIdentnumber() {
        return $this->identnumber;
    }

    /**
     * @param type $identnumber
     * @return \AppAnest\Model\naturalperson
     */
    public function setIdentnumber($identnumber) {
        $this->identnumber = $identnumber;
        return $this;
    }

    /**
     * @return type string
     */
    public function getIdentissuing() {
        return $this->identissuing;
    }

    /**
     * @param type $identissuing
     * @return \AppAnest\Model\naturalperson
     */
    public function setIdentissuing($identissuing) {
        $this->identissuing = $identissuing;
        return $this;
    }

    /**
     * @return type date
     */
    public function getIdentissuingdate() {
        return $this->identissuingdate;
    }

    /**
     * @param type $identissuingdate
     * @return \AppAnest\Model\naturalperson
     */
    public function setIdentissuingdate($identissuingdate) {
        $this->identissuingdate = $identissuingdate;
        return $this;
    }

    /**
     * @return type string
     */
    public function getIdentissuingstate() {
        return $this->identissuingstate;
    }

    /**
     * @param type $identissuingstate
     * @return \AppAnest\Model\naturalperson
     */
    public function setIdentissuingstate($identissuingstate) {
        $this->identissuingstate = $identissuingstate;
        return $this;
    }

    /**
     * @return type string
     */
    public function getCrmnumber() {
        return $this->crmnumber;
    }

    /**
     * @param type $crmnumber
     * @return \AppAnest\Model\naturalperson
     */
    public function setCrmnumber($crmnumber) {
        $this->crmnumber = $crmnumber;
        return $this;
    }

    /**
     * @return type string
     */
    public function getCrmissuingstate() {
        return $this->crmissuingstate;
    }

    /**
     * @param type $crmissuingstate
     * @return \AppAnest\Model\naturalperson
     */
    public function setCrmissuingstate($crmissuingstate) {
        $this->crmissuingstate = $crmissuingstate;
        return $this;
    }

    /**
     * @return type string
     */
    public function getRacecolor() {
        return $this->racecolor;
    }

    /**
     * @param type $racecolor
     * @return \AppAnest\Model\naturalperson
     */
    public function setRacecolor($racecolor) {
        $this->racecolor = $racecolor;
        return $this;
    }

    /**
     * @return type integer
     */
    public function getRegistrationid() {
        return $this->registrationid;
    }

    /**
     * @param type $registrationid
     * @return \AppAnest\Model\naturalperson
     */
    public function setRegistrationid($registrationid) {
        $this->registrationid = $registrationid;
        return $this;
    }

    /**
     * @return type date
     */
    public function getAssociationdate() {
        return $this->associationdate;
    }

    /**
     * @param type $associationdate
     * @return \AppAnest\Model\naturalperson
     */
    public function setAssociationdate($associationdate) {
        $this->associationdate = $associationdate;
        return $this;
    }

}