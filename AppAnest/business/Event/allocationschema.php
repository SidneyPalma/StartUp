<?php

namespace AppAnest\Event;

class allocationschema extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\allocationschema $model
     */
    public function preInsert( \AppAnest\Model\allocationschema &$model ) {

    }

    /**
     * @param \AppAnest\Model\allocationschema $model
     */
    public function posInsert( \AppAnest\Model\allocationschema &$model ) {

    }

    /**
     * @param \AppAnest\Model\allocationschema $model
     */
    public function preUpdate( \AppAnest\Model\allocationschema &$model ) {

    }

    /**
     * @param \AppAnest\Model\allocationschema $model
     */
    public function posUpdate( \AppAnest\Model\allocationschema &$model ) {
        $id = $model->getId();
        $submit = $model->getSubmit();
        $schemaweek = $submit->getRowValue('schemaweek');

        if(strlen($schemaweek) == 0) {
            $sql = "update allocationschemamap set schemamap = null where allocationschemaid = :allocationschemaid";

            $pdo = $this->getProxy()->prepare($sql);

            $pdo->bindValue(":allocationschemaid", $id, \PDO::PARAM_INT);

            $pdo->execute();

            unset($pdo);
        }
    }

    /**
     * @param \AppAnest\Model\allocationschema $model
     */
    public function preDelete( \AppAnest\Model\allocationschema &$model ) {

    }

    /**
     * @param \AppAnest\Model\allocationschema $model
     */
    public function posDelete( \AppAnest\Model\allocationschema &$model ) {

    }

}