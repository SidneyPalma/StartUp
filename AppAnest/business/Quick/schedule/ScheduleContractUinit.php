<?php

namespace AppAnest\Quick\schedule;


use Smart\Utils\Report;
use AppAnest\Setup\Start;

class ScheduleContractUinit extends Report {

    private $daysweek = array('mon'=>1,'tue'=>2,'wed'=>3,'thu'=>4,'fri'=>5,'sat'=>6,'sun'=>7);

    /**
     * @param $month
     * @param $year
     * @return bool|int|string
     * @author http://phil.lavin.me.uk/2013/02/php-find-number-of-weeks-in-a-given-month/#codesyntax_1
     */
    private function weekInMonth($month, $year) {
        $start = mktime(0, 0, 0, $month, 1, $year);
        $end = mktime(0, 0, 0, $month, date('t', $start), $year);
        $start_week = date('W', $start);
        $end_week = date('W', $end);
        if ($end_week < $start_week) {
            return ((52 + $end_week) - $start_week) + 1;
        }
        return ($end_week - $start_week) + 1;
    }

    public function preConstruct() {
        $this->ScheduleMonth = new \DateTime('2015-08-01');
    }

    public function posConstruct() {
        $this->setAllMarginPage(7);
        $this->AddPage();
        $this->SetData();
        $this->Output("ScheduleContractUinit.pdf", "I");
    }

    public function setAllMarginPage($margin) {
        $this->SetMargins($margin,$margin);
        $this->SetAutoPageBreak(true,$margin);
    }

    public function getHeaderColumns() {
        $this->squareWidth = intval($this->getInternalW() / 7);
        $this->SetFont('Arial', 'B', 12);
        $this->SetFillColor(250, 159, 128);
        $this->Cell($this->squareWidth,8,'Segunda',1,0,'C',1);
        $this->Cell($this->squareWidth,8,'Terça',1,0,'C',1);
        $this->Cell($this->squareWidth,8,'Quarta',1,0,'C',1);
        $this->Cell($this->squareWidth,8,'Quinta',1,0,'C',1);
        $this->Cell($this->squareWidth,8,'Sexta',1,0,'C',1);
        $this->Cell($this->squareWidth,8,'Sábado',1,0,'C',1);
        $this->Cell($this->squareWidth,8,'Domingo',1,1,'C',1);
    }

    public function Header(){
        $this->configStyleHeader();

        $this->SetLineWidth(0.4);
        $this->SetFont('Arial', 'B', 18);

        $this->Cell($this->getInternalW(),4, 'Escala da Diretoria',0,1,'C',false);

        $this->Ln(2);
        $this->configStyleLabelHeader();

        $this->SetFont('Arial', '', 14);
        $this->Cell($this->getInternalW(),4, 'Unidade Materno Infantil',0,1,'C',false);
        $this->Ln(2);
    }

    public function getInternalH() {
        return $this->h - ($this->tMargin + $this->bMargin);
    }

    public function getInternalW() {
        return $this->w - ($this->lMargin + $this->rMargin);
    }

    public function setDaysPrint() {
        $j = 1;
        $this->SetFont('Times', '', 18);
        $this->SetTextColor(250, 159, 128);

        $y = $this->ScheduleMonth->format("Y");
        $m = $this->ScheduleMonth->format("m");
        $d = $this->daysweek[strtolower($this->ScheduleMonth->format("D"))];

        $dm = cal_days_in_month(CAL_GREGORIAN,$m,$y);

        foreach($this->verticalLine as $line) {

            $this->setY($line);
            $position = intval(($this->squareHeight / 2) - 12);

            for ($i = $d; $i <= 7; ++$i) {

                $widthColumn = $this->squareWidth * $d;

                if($j <= $dm) {
                    $this->Cell($widthColumn, $position, $j, 0, 0, 'L', 0);
                }

                $j++;
            }

            $d=1;
        }
    }

    public function SetData() {
        $y = 1;
        $this->getHeaderColumns();
        $year = $this->ScheduleMonth->format("Y");
        $month = $this->ScheduleMonth->format("m");
        $week = $this->weekInMonth($month, $year);
        $this->squareHeight = intval(( $this->getInternalH() - $this->y ) / $week);
        $this->verticalLine = array();

        for ($i = 1; $i <= $week; ++$i) {
            $this->verticalLine[] = intval($this->y);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,0,'C',0);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,0,'C',0);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,0,'C',0);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,0,'C',0);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,0,'C',0);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,0,'C',0);
            $this->Cell($this->squareWidth,$this->squareHeight + $y,'',1,1,'C',0);
        }

        $this->setDaysPrint();
    }

}