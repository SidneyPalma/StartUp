<?php

require_once '../../../vendor/autoload.php';

$pdf = new \AppAnest\Quick\schedule\ScheduleMonthly("P");

$pdf->SetMargins(7,7);

$pdf->SetAutoPageBreak(false, 0);

$greyValue = 190;

$pdf->SetFillColor($greyValue,$greyValue,$greyValue);

$date = $pdf->MDYtoJD(8, 1, 2015);
$pdf->printMonth($date);

$pdf->Output();