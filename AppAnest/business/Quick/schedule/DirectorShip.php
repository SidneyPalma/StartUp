<?php

namespace AppAnest\Quick\schedule;

use Smart\Utils\Report;
use Smart\Utils\Session;
use AppAnest\Setup\Start;

class DirectorShip extends Report {

    private $daysweek = array('mon'=>1,'tue'=>2,'wed'=>3,'thu'=>4,'fri'=>5,'sat'=>6,'sun'=>7);

    public function preConstruct() {
        $this->post = (object) self::decodeUTF8($_REQUEST);

        $periodid = $this->post->periodid;
        $contractorunitlist = $this->post->contractorunitlist;

        $list = substr($contractorunitlist, 1, -1);

        $proxy = new \Smart\Data\Proxy(array(Start::getDataBase(), Start::getUserName(), Start::getPassWord()));

        $sql = "
            select
                sp.periodof,
                sp.periodto,
                sm.dutydate,
                sm.contractorunitid,
                c.name as contractorunit,
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
            where sp.periodid = $periodid
              and sm.contractorunitid in ($list)
              and tp.naturalpersonid is not null
            order by cu.position, sm.contractorunitid, sm.dutydate, tp.shift, tp.subunit, tp.position";

        $this->rows = $proxy->query($sql)->fetchAll();

        $this->ScheduleMonth = new \DateTime($this->rows[0]['periodof']);
    }

    public function posConstruct() {
        $this->AliasNbPages();
        $this->AddFont('LucidaSans-Typewriter','','LTYPE.php');
        $this->setAllMarginPage(7);
        $this->AddPage();
        $this->Detail();
        $this->Output("DirectorShip.pdf", "I");
    }

    public function setAllMarginPage($margin) {
        $this->SetMargins($margin,$margin +2);
        $this->SetAutoPageBreak(false,$margin);
    }

    public function getHeaderColumns(&$date,&$week) {

        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(197, 224, 220);

        $this->Cell($this->squareWidth,5,'Segunda - ' . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Terça - '   . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Quarta - '  . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Quinta - '  . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Sexta - '   . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Sábado - '  . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Domingo - ' . $this->AddDay($date,$week)->format("d"),1,1,'C',1);
    }

    public function Header() {
        $this->configStyleHeader(18);
        $year = $this->ScheduleMonth->format("Y");
        $month = $this->translate['monthly'][strtolower($this->ScheduleMonth->format( "M" ))];
        $this->Cell($this->getInternalW(),4, 'Escala para Diretoria - Mês: ' . $month . ' de '. $year,0,1,'C',false);
        $this->Ln(2);
    }

    public function Detail() {
        $q = 0;
        $i = 0;
        $p = 1;
        $w = 1;
        $data = array();
        $this->vLine = array();
        $this->squareWidth = intval($this->getInternalW() / 7);

        foreach($this->rows as $list) {
            $data[$i]['contractorunit'] = $list['contractorunit'];
            $data[$i]['contractorunitid'] = $list['contractorunitid'];
            $i++;
        }

        $data = self::uniqueArray($data);

        $y = $this->ScheduleMonth->format("Y");
        $m = $this->ScheduleMonth->format("m");
        $week = $this->weekInMonth($m, $y);
        $d = $this->daysweek[strtolower($this->ScheduleMonth->format("D"))];
        $this->squareHeight = intval(( $this->getInternalH() - $this->y ) / $week) - 5;

        foreach($data as $item) {
            $this->configStyleHeader(12);
            $this->Cell($this->getInternalW(),4, $item['contractorunit'],0,1,'C',false);
            $date = date("Y-m-d", strtotime($this->ScheduleMonth->format("Y-m-d"). " - $d days"));

            $this->SetLineWidth(0.4);

            for ($i = 1; $i <= $week; ++$i) {
                $this->getHeaderColumns($date,$w);
                $this->vLine[] = intval($this->y);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,0,'C',0);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,0,'C',0);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,0,'C',0);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,0,'C',0);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,0,'C',0);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,0,'C',0);
                $this->Cell($this->squareWidth,$this->squareHeight + $p,'',1,1,'C',0);
            }

            $q++;
            $this->SetLineWidth(0.3);
            $g = $item['contractorunitid'];
            $this->setDaysPrint($y,$m,$d);
            $this->setDaysShift($y,$m,$d,$g);
            if(count($data) > $q) $this->AddPage();
        }
    }

    public function Footer() {
        date_default_timezone_set("America/Manaus");

        $this->SetY(-8);
        $this->SetTextColor(7,23,35);
        $this->SetFont('Arial','',6);

        $passport   = Session::read("username");
        $issuedOn   = "impresso em ";
        $date       = date("d/m/Y H:i");
        $by         = ", por ";
        $page       = "pagina ";
        $of         = " de ";

        $this->Cell(0,4, $issuedOn . $date . $by . $passport,0,0,'L');
        $this->Cell(0,4, $page . $this->PageNo() . $of . '{nb}',0,0,'R');
    }

    public function AddDay(&$date, &$week) {
        $tmp = new \DateTime($date);

        $date = $tmp->format("Y-m-d");
        $date = date("Y-m-d", strtotime($date. " + 1 days"));

        $new = new \DateTime($date);
        $week = $this->daysweek[strtolower($new->format("D"))];

        return $new;
    }

    public function getShiftList($y,$m,$d,$g) {
        $date = str_pad($y,4,'0',STR_PAD_LEFT) . '-' . str_pad($m,2,'0',STR_PAD_LEFT) . '-' . str_pad($d,2,'0',STR_PAD_LEFT);
        $rows = self::searchArray($this->rows,'contractorunitid',$g);
        return self::searchArray($rows,'dutydate',$date);
    }

    public function setDaysPrint($y,$m,$d) {
        $j = 1;
        $widthColumn = $this->squareWidth;
        $dm = cal_days_in_month(CAL_GREGORIAN,$m,$y);

        $this->SetFont('LucidaSans-Typewriter', '', 18);
        $this->SetTextColor(229, 252, 194);

        foreach($this->vLine as $line) {

            $this->setY($line +40);
            $position = intval(($this->squareHeight / 2) - 15);

            for ($i = $d; $i <= 7; ++$i) {

                if($j <= $dm) {

                    if($d != 1) {
                        $this->Cell($widthColumn*($d-1), $position, '', 0, 0, 'L', 0);
                        $d = 1;
                    }

                    $this->Cell($widthColumn, $position, $j, 0, 0, 'L', 0);
                }

                $j++;
            }
        }
    }

    public function setDaysShift($y,$m,$d,$g) {
        $j = 1;
        $type = 0;
        $fill = 0;
        $week = 1;
        $widthColumn = $this->squareWidth;
        $dm = cal_days_in_month(CAL_GREGORIAN,$m,$y);
        $date = date("Y-m-d", strtotime($this->ScheduleMonth->format("Y-m-d"). " - 1 days"));

        $this->SetFont("LucidaSans-Typewriter","",9);
        $this->SetTextColor(48, 51, 50);

        foreach($this->vLine as $line) {

            $this->setY($line);
            $position = intval(($this->squareHeight / 2));

            for ($i = $d; $i <= 7; ++$i) {

                $this->AddDay($date,$week);
                $rows = $this->getShiftList($y,$m,$j,$g);

                if($j <= $dm) {
                    if($d != 1) {
                        foreach($rows as $item) {
                            $this->Cell($widthColumn*($d-1), $position, '', 0, 0, 'L', 0);

                            if($item['shift'] == 'N') {
                                $type++;
                                $fill = 'T';
                            }

                            if($item['allocationschema'] == '010') $this->SetTextColor(201, 30, 73);

                            $this->Cell($widthColumn, 4, $item['naturalperson'], ($type == 1 ? $fill : 0), 1, 'C', 0);
                            $this->SetTextColor(48, 51, 50);

                            $fill = 0;
                        }
                        $d = 1;
                        $type = 0;
                    } else {
                        $this->setY($line);
                        foreach($rows as $item) {

                            if($week > 1) $this->Cell($widthColumn * ($week-1), $position, '', 0, 0, 'L', 0);

                            if($item['shift'] == 'N') {
                                $type++;
                                $fill = 'T';
                            }

                            if($item['allocationschema'] == '010') $this->SetTextColor(201, 30, 73);

                            $this->Cell($widthColumn, 4, $item['naturalperson'], ($type == 1 ? $fill : 0), 1, 'C', 0);
                            $this->SetTextColor(48, 51, 50);

                            $fill = 0;
                        }
                        $type = 0;
                    }
                }

                $j++;
            }
        }
    }

}