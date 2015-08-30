<?php

namespace AppAnest\Quick\schedule;

use AppAnest\Setup\Start;
//use AppAnest\Quick\schedule\ScheduleMonthlyBase;

class ScheduleMonthly extends ScheduleMonthlyBase {

    public function preConstruct() {
        $this->sizeColumns = self::scaleCalc(array_sum($this->sizeColumns),190,$this->sizeColumns);
        $this->setTotalSizeColums();
    }

    public function setTotalSizeColums() {
        $this->totalSizeColums = array_sum($this->sizeColumns);
    }

    public function isHoliday($date) {
        $this->JDtoYMD($date, $year, $month, $day);
        return   $day == 11 ? "Passover" : '';
    }

}