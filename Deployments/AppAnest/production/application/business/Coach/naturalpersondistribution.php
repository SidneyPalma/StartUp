<?php

namespace AppAnest\Coach;

class naturalpersondistribution extends \AppAnest\Setup\Setup {

    /**
     * @var \AppAnest\Model\naturalpersondistribution $model
     */
    public $model = '\AppAnest\Model\naturalpersondistribution';

    public function update() {
        $store = $this->getStore();
        $cache = $store->getCache();
        $model = $store->getModel();
        $proxy = $store->getProxy();
        $submit = $model->getSubmit();

        $data = array();
        $rows = $submit->getRow();

        $sqlWeekDay = "
            select
                etl.code as weekday
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = 'weekday'";

        $weekdayRows = $proxy->query($sqlWeekDay)->fetchAll();

        $shift = $rows["shift"];
        $naturalpersonid = $rows["naturalpersonid"];

        $results = self::getResultToJson();

        // Dia da semana = Noturno
        if ( $shift == 'N' ) {
            $list = array();
            $list[]['weekday'] = $submit->getRawValue('weekday');
            $weekdayRows = $list;
        }

        foreach ($weekdayRows as $recWeekday) {
            $weekday = $recWeekday["weekday"];

            $id = $rows["$weekday".'id'];
            $contractorunitid = $rows[$weekday];

            $data['id'] = $id;
            $data['shift'] = $shift;
            $data['weekday'] = $weekday;
            $data['naturalpersonid'] = $naturalpersonid;
            $data['contractorunitid'] = $contractorunitid;

            $store->getModel()->getSubmit()->setRow($data);
            $store->getModel()->setRecord();

            $update = isset($id) ? strlen($id) !== 0 : false;

            if ( $shift == 'N' ) {
                unset($data['id']);
                unset($data['contractorunitid']);
                $store->getModel()->getSubmit()->setRow($data);
                $store->getModel()->setRecord();
                if($update == true) {
                    $data = array();
                    $data['id'] = $id;
                    $store->getModel()->getSubmit()->setRow($data);
                    $store->getModel()->setRecord();
                    $results = $store->delete();
                } else {
                    $results = $store->insert();
                }
            }

            if ( $shift == 'D' ) {
                if (strlen($contractorunitid) !== 0) {
                    if ($update == true) {
                        $results = $store->update();
                    } else {
                        $results = $store->insert();
                    }
                } else {
                    if ($update == true) {
                        $data = array();
                        $data['id'] = $id;
                        $store->getModel()->getSubmit()->setRow($data);
                        $store->getModel()->setRecord();
                        $results = $store->delete();
                    }
                }
            }
        }

        // Filtrar Turno
        if(self::jsonToObject($results)->success == true) {
            $data = array('query'=>$naturalpersonid,'entry'=>$shift);
            $results =$cache->selectCode($data);
        }

        return $results;
    }

}