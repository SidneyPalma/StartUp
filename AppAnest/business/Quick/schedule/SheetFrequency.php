<?php

namespace AppAnest\Quick\schedule;


use Smart\Utils\Report;
use Smart\Utils\Session;
use AppAnest\Setup\Start;

class SheetFrequency extends Report {

    private $proxy;

    private $sizeColumns = array(30,30,4,30,30,30,4,30);

    private function setTableSchedule ($period, $sql) {
        $list = array("P", "C", "E");

        $rows = $this->proxy->query("select status from schedulingperiod where id = $period")->fetchAll();
        $status = $rows[0]['status'];

        $tablename = (in_array($status, $list)) ? 'schedulingmonthlypartners' : 'tmp_turningmonthly';

        return str_replace("_tablename_", $tablename, $sql);
    }

    public function preConstruct() {

        $this->post = (object) self::decodeUTF8($_REQUEST);

        $dateof = $this->post->dateof;
        $dateto = $this->post->dateto;

        $status = $this->post->status;
        $periodid = $this->post->periodid;
        $contractorunitid = $this->post->contractorunitid;
        $subunit = isset($this->post->subunit) ? $this->post->subunit : 'P';

        $this->proxy = new \Smart\Data\Proxy(array(Start::getDataBase(), Start::getUserName(), Start::getPassWord()));

        $this->sizeColumns = self::scaleCalc(array_sum($this->sizeColumns),190,$this->sizeColumns);
        $this->setTotalSizeColums();

        $sql = "
            select
                sp.periodof,
                sp.periodto,
                sm.dutydate,
                c.name as contractorunit,
                n.shortname as naturalperson,
                tp.shift,
                tp.subunit
            from
                schedulingmonthly sm
                inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
                inner join _tablename_ tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
                left join person n on ( n.id = tp.naturalpersonid )
            where sp.id = :periodid
              and sm.contractorunitid = :contractorunitid
              and tp.naturalpersonid is not null
              and tp.subunit = :subunit
              and sm.dutydate between :dateof and :dateto
            order by sm.dutydate, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

        $sql = $this->setTableSchedule($periodid,$sql);

        $pdo = $this->proxy->prepare($sql);

        $pdo->bindValue(":dateof", $dateof, \PDO::PARAM_STR);
        $pdo->bindValue(":dateto", $dateto, \PDO::PARAM_STR);
        $pdo->bindValue(":subunit", $subunit, \PDO::PARAM_STR);
        $pdo->bindValue(":periodid", $periodid, \PDO::PARAM_INT);
        $pdo->bindValue(":contractorunitid", $contractorunitid, \PDO::PARAM_INT);

        $pdo->execute();
        $this->rows = $pdo->fetchAll();
    }

    public function posConstruct() {
        $this->AliasNbPages();
        $this->AddPage();
        $this->Detail();
        $this->AddPage();
        $this->SetObservation();
        $this->Output("SheetFrequency.pdf", "I");
    }

    function SetObservation () {
        $this->configStyleHeader();

        $this->SetLineWidth(0.4);
        $this->SetFont('Arial', 'B', 22);

        $this->Cell(190,4, 'Observações',0,1,'C',false);
        $this->Cell($this->totalSizeColums,6,'','B',1,'C',0);

        $this->configStyleDetail();

        for ($x = 0; $x <= 21; $x++) {
            $this->Cell($this->totalSizeColums,10,'','B',1,'C');
        }
    }

    function SetCoverPage () {

        $subunittext = $this->post->subunittext;

        $this->Ln(60);
        $this->SetFont('Arial', 'B', 28);
        $this->Cell(190,36, 'FAVOR CARIMBAR E ASSINAR',0,1,'C',false);
        $this->SetFont('Arial', 'B', 24);
        $this->Cell(190,24, 'Folha de Frequência',0,1,'C',false);
        $this->Image("../../../resources/images/appanest/logo-text.png",60,30,80,20,"PNG");

        $periodof = new \DateTime($this->post->dateof);
        $periodto = new \DateTime($this->post->dateto);

        $this->Ln(10);
        $this->SetFont('Arial', 'B', 16);
        $this->Cell(190,6, $this->rows[0]['contractorunit'],0,1,'C',false);

        $month = $this->translate['monthly'][ strtolower($periodof->format( "M" ))];
        $this->Cell(190,6, $month . $periodof->format( "/Y" ),0,1,'C',false);

        $this->SetFont('Arial', '', 12);
        $this->Cell(190,6, $periodof->format( "d/m/Y" ) . ' - ' . $periodto->format( "d/m/Y" ) . ' - ' . $subunittext,0,1,'C',false);
    }

    function setTotalSizeColums() {
        $this->totalSizeColums = array_sum($this->sizeColumns);
    }

    function getHeaderColumns() {

        $columns = array(
            array($this->sizeColumns[0],'Cooperado','L'),
            array($this->sizeColumns[1],'Assinatura','L'),
            array($this->sizeColumns[2],'','C'),
            array($this->sizeColumns[3],'CRM','L'),
            array($this->sizeColumns[4],'Cooperado','L'),
            array($this->sizeColumns[5],'Assinatura','L'),
            array($this->sizeColumns[6],'','C'),
            array($this->sizeColumns[7],'CRM','L')
        );

        return $columns;
    }

    function Header(){

        if($this->PageNo() == 1) {
            $this->SetCoverPage();
            $this->AddPage();
        } else {
            $subunittext = $this->post->subunittext;
            $contractorunit = $this->rows[0]['contractorunit'];
            $periodof = new \DateTime($this->post->dateof);
            $periodto = new \DateTime($this->post->dateto);

            $this->configStyleHeader();

            $this->SetLineWidth(0.4);
            $this->SetFont('Arial', 'B', 14);

            $month = $this->translate['monthly'][ strtolower($periodof->format( "M" ))];
            $this->Cell(190,4, 'Folha de Frequência - ' . $month . $periodof->format( "/Y" ),0,1,'C',false);

            $this->Ln(2);
            $this->SetFont('Arial', '', 10);
            $this->Cell(190,4, $contractorunit,0,1,'C',false);
            $this->SetFont('Arial', '', 10);
            $this->Cell(190,6, $periodof->format( "d/m/Y" ) . ' - ' . $periodto->format( "d/m/Y" ) .' - '. $subunittext,0,1,'C',false);

            $this->configStyleLabelHeader();

            $this->SetFillColor(240, 220, 142);
            $this->loadLabel($this->getHeaderColumns(),12);
        }
    }

    function configHeaderDutyDate () {
        $this->SetFont('Arial', 'B', 9);
        $this->Cell($this->sizeColumns[0],6,'Diurnos','B',0,'C',0);
        $this->Cell($this->sizeColumns[1],6,'Plantonista','B',0,'L',0);
        $this->Cell($this->sizeColumns[2],6,'','B',0,'C',0);
        $this->Cell($this->sizeColumns[3],6,'Pagar para','B',0,'L',0);
        $this->Cell($this->sizeColumns[4],6,'Noturnos','B',0,'C',0);
        $this->Cell($this->sizeColumns[5],6,'Plantonista','B',0,'L',0);
        $this->Cell($this->sizeColumns[6],6,'','B',0,'C',0);
        $this->Cell($this->sizeColumns[7],6,'Pagar para','B',1,'L',0);
    }

    function setDutyDateShift (array $rows) {
        $d = 0;
        $n = 0;
        $list = array();
        $temp = array();
        $uniq = array();

        foreach($rows as $record) {
            $list[]['dutydate'] = $record['dutydate'];
        }

        $list = self::uniqueArray($list);

        foreach($list as $key=>$val) {
            $data = self::searchArray($rows,'dutydate',$val['dutydate']);

            foreach($data as $item) {
                if($item['shift'] == 'D') {
                    $uniq[$d]['dutydate'] = $item['dutydate'];
                    $uniq[$d]['shiftd'] = $item['naturalperson'];
                    $d++;
                }
                if($item['shift'] == 'N') {
                    $uniq[$n]['dutydate'] = $item['dutydate'];
                    $uniq[$n]['shiftn'] = $item['naturalperson'];
                    $n++;
                }
            }

            $temp = array_merge($temp,$uniq);
        }

        return self::uniqueArray($temp);
    }

    function Detail() {
        $data = $this->setDutyDateShift($this->rows);

        $this->configStyleDetail();

        $dutydate = '';

        foreach($data as $record) {
            $lineColor = 0;

            if($dutydate != $record['dutydate'] && $dutydate != '') {
                $this->Ln(6);
            }

            if($dutydate != $record['dutydate']) {
                $this->SetFont('Arial', 'B', 9);
                $dutydateName = new \DateTime($record['dutydate']);
                $month = $this->translate['monthly'][strtolower($dutydateName->format( "M" ))];
                $day = $dutydateName->format( "d" );
                $week = $this->translate['dayweek'][strtolower($dutydateName->format( "D" ))];
                $this->Cell($this->sizeColumns[0],4,$week . ', '. $day. ' de ' . $month .  $dutydateName->format( "/Y" ),0,1,'L',0);
                $this->configHeaderDutyDate();
            }

            $this->configStyleDetail(9);
            $this->Cell($this->sizeColumns[0],8,isset($record['shiftd']) ? $record['shiftd'] : '',0,0,'C',$lineColor);
            $this->Cell($this->sizeColumns[1],8,'','B',0,'L',$lineColor);
            $this->Cell($this->sizeColumns[2],8,'',0,0,'C',$lineColor);
            $this->Cell($this->sizeColumns[3],8,'','B',0,'L',$lineColor);
            $this->Cell($this->sizeColumns[4],8,isset($record['shiftn']) ? $record['shiftn'] : '',0,0,'C',$lineColor);
            $this->Cell($this->sizeColumns[5],8,'','B',0,'L',$lineColor);
            $this->Cell($this->sizeColumns[6],8,'',0,0,'C',$lineColor);
            $this->Cell($this->sizeColumns[7],8,'','B',1,'L',$lineColor);

            $dutydate = $record['dutydate'];
        }
    }

    function Footer(){
        $this->configStyleFooter();
        $this->loadFooter($this->totalSizeColums);
    }

}