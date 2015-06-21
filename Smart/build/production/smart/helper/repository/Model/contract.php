<?php

namespace AppAnest\Model;

/**
 * 
 * @Entity {"name":"contract", "cache":"\\AppAnest\\Cache\\contract", "event":"\\AppAnest\\Event\\contract"}
 */
class contract extends \Smart\Data\Model {

    /**
     * @Policy {"nullable":false}
     * @Column {"description":"", "type":"integer", "policy":true}
     */
    private $id;

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

}