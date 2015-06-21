<?php

namespace AppAnest\Event;

class contract extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\contract $model
     */
    public function preInsert( \AppAnest\Model\contract &$model ) {

    }

    /**
     * @param \AppAnest\Model\contract $model
     */
    public function posInsert( \AppAnest\Model\contract &$model ) {
        $id = $model->getId();

        $additive = new \AppAnest\Coach\additive();

        $additiveModel = $additive->getStore()->getModel();
        $additiveModel->setContractid($id);
        $additiveModel->setAdditivenumber('000');
        $additiveModel->getSubmit()->setRawValue('contractid',$id);
        $additiveModel->getSubmit()->setRowValue('contractid',$id);

        $statement = $this->getProxy()->sqlInsert($additiveModel);
        $statement->execute();
    }

    /**
     * @param \AppAnest\Model\contract $model
     */
    public function preUpdate( \AppAnest\Model\contract &$model ) {

    }

    /**
     * @param \AppAnest\Model\contract $model
     */
    public function posUpdate( \AppAnest\Model\contract &$model ) {

    }

    /**
     * @param \AppAnest\Model\contract $model
     */
    public function preDelete( \AppAnest\Model\contract &$model ) {

    }

    /**
     * @param \AppAnest\Model\contract $model
     */
    public function posDelete( \AppAnest\Model\contract &$model ) {

    }

}