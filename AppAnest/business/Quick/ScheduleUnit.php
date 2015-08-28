<?php

namespace AppAnest\Quick;


use Smart\Utils\Report;
use AppAnest\Setup\Start;

class ScheduleUnit extends Report {

    private $sizeColumns = array(30,30,30,30,30,30,30);

    public function preConstruct() {
        $this->sizeColumns = self::scaleCalc(array_sum($this->sizeColumns),190,$this->sizeColumns);
        $this->setParamTitleNames();
        $this->setTotalSizeColums();
    }

    function setParamTitleNames() {
        $this->paramTitleNames = array(array('OlaMundo'),array('Cruel'));
    }

    function setTotalSizeColums() {
        $this->totalSizeColums = array_sum($this->sizeColumns);
    }

    function getHeaderColumns() {

        $columns = array(
            array($this->sizeColumns[0],'Segunda','L'),
            array($this->sizeColumns[1],'Terca','L'),
            array($this->sizeColumns[2],'Quarta','L'),
            array($this->sizeColumns[3],'Quinta','L'),
            array($this->sizeColumns[4],'Sexta','L'),
            array($this->sizeColumns[5],'Sabado','L'),
            array($this->sizeColumns[6],'Domingo','R')
        );

        return $columns;
    }

    public function loadHeader($title){
        $this->Cell(190,4, $title,0,1,'C',false);
    }

    function Header(){

        //Config style labels header
        $this->configStyleHeader();

        $this->SetLineWidth(0.4);
        $this->SetFont('Arial', 'B', 22);

        //Load Header
        $this->loadHeader('Listagem de Escala de Unidades ');

        //Config style parametres header
        $this->configStyleParameterHeader();

        //Load Parameters
//        $this->loadHeaderParameters($this->paramTitleNames, $this->totalSizeColums);
    }

    function SetData(){
        // size Columns
        $columns = $this->getHeaderColumns();

        $link = array(Start::getDataBase(), Start::getUserName(), Start::getPassWord());

        $proxy = new \Smart\Data\Proxy($link);

        $sql = "
            select
                sm.dutydate,
                sm.contractorunitid,
                c.shortname as contractorunit,
                substring(lower(dayname(sm.dutydate)),1,3) as dayname,
                tp.position,
                tp.naturalpersonid,
                n.shortname as naturalperson,
                tp.shift,
                tp.subunit,
                tp.releasetype,
                tp.allocationschema
            from
                schedulingmonthly sm
                inner join contractorunit cu on ( cu.id = sm.contractorunitid )
                inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
                inner join tmp_turningmonthly tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
                left join person n on ( n.id = tp.naturalpersonid )
            where sp.periodid = 2
              and sm.contractorunitid = 43
            order by sm.contractorunitid, sm.dutydate, cu.position, tp.shift, tp.subunit, tp.position";

        $rows = $proxy::encodeUTF8($proxy->query($sql)->fetchAll());

        //Line Color Control
        $lineColor = 1;

        //Config style labels header
        $this->configStyleLabelHeader();

        $this->loadLabel($columns,12);

        foreach($rows as $record) {

            if($lineColor == 0) { $lineColor = 1; } else { $lineColor = 0; }

            //Config Style Details
            $this->configStyleDetail();

            $this->Cell($this->sizeColumns[0],4,$record['contractorunit'],0,0,'L',$lineColor);
            $this->Cell($this->sizeColumns[1],4,$record['dayname'],0,0,'L',$lineColor);
            $this->Cell($this->sizeColumns[2],4,$record['position'],0,0,'L',$lineColor);
            $this->Cell($this->sizeColumns[3],4,$record['shift'],0,0,'L',$lineColor);
            $this->Cell($this->sizeColumns[4],4,$record['subunit'],0,0,'L',$lineColor);
            $this->Cell($this->sizeColumns[5],4,$record['releasetype'],0,0,'L',$lineColor);
            $this->Cell($this->sizeColumns[6],4,$record['allocationschema'],0,1,'R',$lineColor);
        }

    }

    function Footer(){
        $this->configStyleFooter();
        $this->loadFooter($this->totalSizeColums);
    }

}

$report = new ScheduleUnit('P');
$report->AliasNbPages();
$report->AddPage();
$report->SetData();
$report->Output("ScheduleUnit.pdf", "I");
ob_clean();