<?php

namespace Smart\Data;

use Smart\Common\Traits as Traits;

/**
 * Ancestral para as classes do tipo Listeners
 *
 * @methods: getProxy, preUpdate, posUpdate, preInsert, posInsert, preDelete posDelete
 * @category Event
 */
class Event {
    use Traits\TresultSet,
        Traits\TvalidField,
        Traits\TuserHandler;

    /**
     * Proxy de Acesso ao Banco de Dados
     * Permite o Crude e statements SQL´s
     *
     * @var null|\Smart\Data\Proxy
     */
    private $proxy = null;

    /**
     * @param \Smart\Data\Proxy $proxy
     */
    public function __construct( \Smart\Data\Proxy &$proxy ) {
        $this->proxy = $proxy;
    }

    public function getProxy () {
        return $this->proxy;
    }

    /**
     * Evento antes do SQLUpdate
     * 
     * @param type <b>&$entity</b> by reference
     * 
     * Call Exception if necessary<br/>
     * Example:<br/>
     * throw new \PDOException('this error');<br/>
     * 
     * @author Samuel Oliveira <samuca95@hotmail.com>
     * @category listeners
     */
    public function preUpdate(&$entity) {
        
    }
    
    /**
     * Evento após o SQLUpdate
     * 
     * @param type <b>&$entity</b> by reference
     * 
     * Call Exception if necessary<br/>
     * Example:<br/>
     * throw new \PDOException('this error');<br/>
     * 
     * @author Samuel Oliveira <samuca95@hotmail.com>
     * @category listeners
     */
    public function posUpdate(&$entity) {

    }
    
    /**
     * Evento antes do SQLInsert
     * 
     * @param type <b>&$entity</b> by reference
     * 
     * Call Exception if necessary<br/>
     * Example:<br/>
     * throw new \PDOException('this error');<br/>
     * 
     * @author Samuel Oliveira <samuca95@hotmail.com>
     * @category listeners
     */
    public function preInsert(&$entity) {
        
    }
    
    /**
     * Evento após o SQLInsert
     * 
     * @param type <b>&$entity</b> by reference
     * 
     * Call Exception if necessary<br/>
     * Example:<br/>
     * throw new \PDOException('this error');<br/>
     * 
     * @author Samuel Oliveira <samuca95@hotmail.com>
     * @category listeners
     */
    public function posInsert(&$entity) {
        
    }
    
    /**
     * Evento antes do SQLDelete
     * 
     * @param type <b>&$entity</b> by reference
     * 
     * Call Exception if necessary<br/>
     * Example:<br/>
     * throw new \PDOException('this error');<br/>
     * 
     * @author Samuel Oliveira <samuca95@hotmail.com>
     * @category listeners
     */
    public function preDelete(&$entity) {
        
    }
    
    /**
     * Evento após o SQLDelete
     *
     * @param type <b>&$entity</b> by reference
     * 
     * Call Exception if necessary<br/>
     * Example:<br/>
     * throw new \PDOException('this error');<br/>
     * 
     * @author Samuel Oliveira <samuca95@hotmail.com>
     * @category listeners
     */
    public function posDelete(&$entity) {
        
    }
    
}