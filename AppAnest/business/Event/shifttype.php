<?php

namespace AppAnest\Event;

class shifttype extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\shifttype $model
     */
    public function preInsert( \AppAnest\Model\shifttype &$model ) {
        $dutytype = array('I','F');
        $hours = $model->getHours();

        if(!in_array($model->getDutytype(), $dutytype)) {
            throw new \PDOException('Tipo de Plantão inválido!');
        }

        if(intval($hours) < 1 || intval($hours) > 12) {
            throw new \PDOException('Quantidade de horas inválida!');
        }
    }

    /**
     * @param \AppAnest\Model\shifttype $model
     */
    public function posInsert( \AppAnest\Model\shifttype &$model ) {

    }

    /**
     * @param \AppAnest\Model\shifttype $model
     */
    public function preUpdate( \AppAnest\Model\shifttype &$model ) {
        $this->preInsert($model);
    }

    /**
     * @param \AppAnest\Model\shifttype $model
     */
    public function posUpdate( \AppAnest\Model\shifttype &$model ) {

    }

    /**
     * @param \AppAnest\Model\shifttype $model
     */
    public function preDelete( \AppAnest\Model\shifttype &$model ) {

    }

    /**
     * @param \AppAnest\Model\shifttype $model
     */
    public function posDelete( \AppAnest\Model\shifttype &$model ) {

    }

}