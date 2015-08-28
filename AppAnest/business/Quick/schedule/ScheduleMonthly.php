<?php

namespace AppAnest\Quick\schedule;


use Smart\Utils\Report;
use AppAnest\Setup\Start;

class ScheduleMonthly extends Report {


    private $sizeColumns = array(30,30,30,30,30,30,30);

    public function preConstruct() {

        $this->post = (object) self::decodeUTF8($_REQUEST);

        $dateof = $this->post->dateof;
        $dateto = $this->post->dateto;

        $periodid = $this->post->periodid;
        $contractorunitid = $this->post->contractorunitid;
        $subunit = isset($this->post->subunit) ? $this->post->subunit : 'P';

        $this->sizeColumns = self::scaleCalc(array_sum($this->sizeColumns),190,$this->sizeColumns);
        $this->setParamTitleNames();
        $this->setTotalSizeColums();

        $proxy = new \Smart\Data\Proxy(array(Start::getDataBase(), Start::getUserName(), Start::getPassWord()));

        $sql = "
            select
                sp.periodof,
                sp.periodto,
                sm.dutydate,
                sm.contractorunitid,
                c.shortname as contractorunit,
                tp.naturalpersonid,
                n.shortname as naturalperson,
                tp.shift,
                tp.subunit
            from
                schedulingmonthly sm
                inner join contractorunit cu on ( cu.id = sm.contractorunitid )
                inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
                inner join tmp_turningmonthly tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
                left join person n on ( n.id = tp.naturalpersonid )
            where sp.periodid = 2
              and sm.contractorunitid = 43
              and tp.naturalpersonid is not null
            order by sm.contractorunitid, sm.dutydate, tp.shift, cu.position, tp.subunit, tp.position";

        $this->rows = $proxy->query($sql)->fetchAll();

    }

    public function posConstruct() {
        $this->AliasNbPages();
        $this->AddPage();
        $this->SetData();
        $this->AddPage();
        $this->SetObservation();
        $this->Output("ScheduleMonthly.pdf", "I");
        ob_clean();
    }

    function Footer(){
        $this->configStyleFooter();
        $this->loadFooter($this->totalSizeColums);
    }
}