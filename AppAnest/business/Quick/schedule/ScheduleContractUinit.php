<?php

namespace AppAnest\Quick\schedule;

use Smart\Utils\Report;
use AppAnest\Setup\Start;

class ScheduleContractUinit extends Report {

    private $daysweek = array('mon'=>1,'tue'=>2,'wed'=>3,'thu'=>4,'fri'=>5,'sat'=>6,'sun'=>7);

    public function preConstruct() {
        $this->ScheduleMonth = new \DateTime('2015-09-01');

        $this->post = (object) self::decodeUTF8($_REQUEST);

        $proxy = new \Smart\Data\Proxy(array(Start::getDataBase(), Start::getUserName(), Start::getPassWord()));

        $sql = "
            select
                sp.periodof,
                sp.periodto,
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
            where sp.periodid = 4
              and sm.contractorunitid = 43
              and tp.naturalpersonid is not null
            order by sm.contractorunitid, sm.dutydate, tp.shift, cu.position, tp.subunit, tp.position";

        $this->rows = $proxy->query($sql)->fetchAll();
    }

    public function posConstruct() {
        $this->AddFont('LucidaSans-Typewriter','','LTYPE.php');
        $this->setAllMarginPage(7);
        $this->AddPage();
        $this->Detail();
        $this->Output("ScheduleContractUinit.pdf", "I");
    }

    public function setAllMarginPage($margin) {
        $this->SetMargins($margin,$margin +2);
        $this->SetAutoPageBreak(true,$margin);
    }

    public function getHeaderColumns(&$date,&$week) {

        $this->SetFont('Arial', 'B', 9);
        $this->SetFillColor(159,198,204);

        $this->Cell($this->squareWidth,5,'Segunda - ' . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Ter�a - '   . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Quarta - '  . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Quinta - '  . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Sexta - '   . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'S�bado - '  . $this->AddDay($date,$week)->format("d"),1,0,'C',1);
        $this->Cell($this->squareWidth,5,'Domingo - ' . $this->AddDay($date,$week)->format("d"),1,1,'C',1);
    }

    public function Header() {
        $this->configStyleHeader();
        $this->SetFont('Arial', 'B', 18);

        $this->Cell($this->getInternalW(),4, 'Escala da Diretoria',0,1,'C',false);

        $this->Ln(2);
        $this->configStyleLabelHeader();

        $this->SetFont('Arial', '', 14);
        $this->Cell($this->getInternalW(),4, 'Unidade Materno Infantil',0,1,'C',false);
        $this->Ln(2);
    }

    public function Detail() {
        $p = 1;
        $w = 1;
        $this->vLine = array();
        $this->squareWidth = intval($this->getInternalW() / 7);

        $y = $this->ScheduleMonth->format("Y");
        $m = $this->ScheduleMonth->format("m");
        $week = $this->weekInMonth($m, $y);
        $d = $this->daysweek[strtolower($this->ScheduleMonth->format("D"))];
        $this->squareHeight = intval(( $this->getInternalH() - $this->y ) / $week) - 5;
        $date = date("Y-m-d", strtotime($this->ScheduleMonth->format("Y-m-d"). " - $d days"));

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

        $this->setDaysPrint($y,$m,$d);
        $this->setDaysShift($y,$m,$d);
    }

    public function AddDay(&$date, &$week) {
        $tmp = new \DateTime($date);

        $date = $tmp->format("Y-m-d");
        $date = date("Y-m-d", strtotime($date. " + 1 days"));

        $new = new \DateTime($date);
        $week = $this->daysweek[strtolower($new->format("D"))];

        return $new;
    }

    public function getInternalH() {
        return $this->h - ($this->tMargin + $this->bMargin);
    }

    public function getInternalW() {
        return $this->w - ($this->lMargin + $this->rMargin);
    }

    public function getShiftList($y,$m,$d) {
        $date = str_pad($y,4,'0',STR_PAD_LEFT) . '-' . str_pad($m,2,'0',STR_PAD_LEFT) . '-' . str_pad($d,2,'0',STR_PAD_LEFT);
        return self::searchArray($this->rows,'dutydate',$date);
    }

    public function setDaysPrint($y,$m,$d) {
        $j = 1;
        $widthColumn = $this->squareWidth;
        $dm = cal_days_in_month(CAL_GREGORIAN,$m,$y);

        $this->SetFont('LucidaSans-Typewriter', '', 16);
        $this->SetTextColor(205, 222, 248);

        foreach($this->vLine as $line) {

            $this->setY($line);
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

    public function setDaysShift($y,$m,$d) {
        $j = 1;
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
                $rows = $this->getShiftList($y,$m,$j);

                if($j <= $dm) {
                    if($d != 1) {
                        foreach($rows as $item) {
                            $this->Cell($widthColumn*($d-1), $position, '', 0, 0, 'L', 0);
                            if($item['shift'] == 'N') {
                                $this->SetTextColor(201, 30, 73);
                            }
                            $this->Cell($widthColumn, 4, $item['naturalperson'], 0, 1, 'C', 0);
                            $this->SetTextColor(48, 51, 50);
                        }
                        $d = 1;
                    } else {
                        $this->setY($line);
                        foreach($rows as $item) {
                            if ($week > 1) $this->Cell($widthColumn * ($week-1), $position, '', 0, 0, 'L', 0);
                            if($item['shift'] == 'N') {
                                $fill = 'T';
                                $this->SetTextColor(201, 30, 73);
                                $this->SetFillColor(248,246,249);
                            }
                            $this->Cell($widthColumn, 4, $item['naturalperson'], $fill, 1, 'C', 0);
                            $this->SetTextColor(48, 51, 50);
                            $fill = 0;
                        }
                    }
                }

                $j++;
            }
        }
    }

}