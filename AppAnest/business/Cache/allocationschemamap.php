<?php

namespace AppAnest\Cache;

use PHPExcel;
use PHPExcel_Cell;
use PHPExcel_Style;
use PHPExcel_IOFactory;
use PHPExcel_Style_Fill;
use PHPExcel_Style_Color;
use PHPExcel_Style_Border;
use PHPExcel_Style_Alignment;
use PHPExcel_Reader_Excel2007;
use PHPExcel_Reader_Excel2005;
use PHPExcel_Style_Conditional;
use PHPExcel_Worksheet_ColumnDimension;
use PHPExcel_CachedObjectStorage_Memory;

use AppAnest\Model\allocationschemamap as Model;

class allocationschemamap extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $allocationschemaid = $data['allocationschemaid'];

        $proxy = $this->getStore()->getProxy();

        $sql = "
            select
                asm.id,
                asm.schemamap,
                etl.code as weekday,
                asm.weekold,
                asm.weeknew,
                :allocationschemaid as allocationschemaid,
                etl.description as weekdaydescription
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
                left join allocationschemamap asm on (
                    asm.weekday = etl.code
                    and asm.allocationschemaid = :allocationschemaid
                )
            where et.name = 'weekday'
            order by etl.orderby";

        try {
            $pdo = $proxy->prepare($sql);

            $pdo->bindValue(":allocationschemaid", $allocationschemaid, \PDO::PARAM_INT);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function selectWeekDay(array $data) {
        $id = $data['id'];
        $weekday = $data["weekday"];
        $i_cutecost = $data["positioncute"];
        $crsContractorUnit = array();
        $tmpTurningMonthly = array();
        $turningHorizontal = array();

        $proxy = $this->getStore()->getProxy();

        $positionWeek = 'position' . $weekday;

        $orderBy = $proxy->query("select id from contractorunit order by $positionWeek")->fetchAll();

        // Obter novo
        $pdo = $proxy->prepare("select schemaweek from allocationschema where id = :id");

        $pdo->bindValue(":id", $id, \PDO::PARAM_INT);

        $pdo->execute();
        $json = self::encodeUTF8($pdo->fetchAll());

        $rows = self::jsonToArray($json[0]["schemaweek"]);

        $position = 0;
        $rownumber = 0;
        $contractorunitid = '';

        $list = array();

        // Ordenando pelo dia da Semana
        foreach ($orderBy as $order) {
            $id = intval($order['id']);
            foreach ($rows as $record) {
                $unit = intval($record["contractorunitid"]);
                if ($id == $unit) {
                    $list[] = $record;
                }
            }
        }

        // Construindo a Lista de Unidades
        foreach ($list as $record) {
            if ($record[$weekday] == "002") {
                if($contractorunitid !== $record["contractorunitid"]) $position++;
                $crsContractorUnit[$rownumber]["position"] = $position;
                $crsContractorUnit[$rownumber]["contractorunit"] = $record["contractorunit"];
                $crsContractorUnit[$rownumber]["contractorunitid"] = $record["contractorunitid"];
                $rownumber++;
                $contractorunitid = $record["contractorunitid"];
            }
        }

        $finded = false;

        // realinhar posição de corte
        $rownumber = 1;
        foreach ($crsContractorUnit as $record) {
            if ( (intval($record["position"]) == intval($i_cutecost)) && ($finded == false) ) {
                $finded = true;
                $i_cutecost = $rownumber;
            }
            $rownumber++;
        }

        $week = 1;

        $i_position = 1;
        $loopnumber = 1;
        $weeknumber = count($crsContractorUnit);

        // para cada Coluna = $week
        while ($week <= $weeknumber) {

            // obtem as unidades
            foreach ($crsContractorUnit as $record) {
                $position = intval($record["position"]);
                $contractorunit = $record["contractorunit"];
                $contractorunitid = intval($record["contractorunitid"]);

                $tmpTurningMonthly[$loopnumber]["position"] = str_pad($position,2,"0",STR_PAD_LEFT);
                $tmpTurningMonthly[$loopnumber]["positioncute"] = $i_cutecost;
                $tmpTurningMonthly[$loopnumber]["contractorunit"] = $contractorunit;
                $tmpTurningMonthly[$loopnumber]["contractorunitid"] = $contractorunitid;
                $tmpTurningMonthly[$loopnumber]["week" . str_pad($week,2,"0",STR_PAD_LEFT)] = $i_position;

                $loopnumber++;
                $i_position++;

                if($i_position > $weeknumber)  {
                    $i_position = 1;
                }
            }

            $week++;

            if ($week != 1) {
                $i_position = $tmpTurningMonthly[intval($i_cutecost)]["week" . str_pad($week-1,2,"0",STR_PAD_LEFT)];
            }

            $loopnumber = 1;
        }

        $id = 1;
        foreach ($tmpTurningMonthly as $record=>$fields) {
            $fields['id'] = $id;
            $turningHorizontal[] = $fields;
            $id++;
        }

        unset($crsContractorUnit);
        unset($tmpTurningMonthly);

        self::_setRows($turningHorizontal);

        return self::getResultToJson();
    }

    public function getWorkSheetWeekDay(array $data) {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        $schemamap = isset($_GET["schemamap"]) ? $_GET["schemamap"] : null;

        if(isset($id)) {
            $sql = "
                select
                    upper(getEnum('weekday',m.weekday)) as weekdaydesciption,
                    m.schemamap,
                    m.weekold,
                    m.weeknew
                from
                    allocationschemamap m
                    inner join allocationschema a on ( a.id = m.allocationschemaid )
                where m.id = :id";

            $pdo = $this->getStore()->getProxy()->prepare($sql);

            $pdo->bindValue(":id", $id, \PDO::PARAM_INT);

            $pdo->execute();
            $day = self::encodeUTF8($pdo->fetchAll());
            $weekold = intval($day[0]["weekold"]);
            $weeknew = intval($day[0]["weeknew"]);
            $schemamap = $day[0]["schemamap"];
            $weekdaydesciption = $day[0]["weekdaydesciption"];
        }

        $rows = self::jsonToArray($this->removeAccents($schemamap));

        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getActiveSheet()->setTitle("MAPA");
//        $objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
//                    ->setLastModifiedBy("Maarten Balliauw")
//                    ->setTitle("Office 2007 XLSX Test Document")
//                    ->setSubject("Office 2007 XLSX Test Document")
//                    ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
//                    ->setKeywords("office 2007 openxml php")
//                    ->setCategory("Test result file");

        $sharedStyle1 = new PHPExcel_Style();
        $sharedStyle2 = new PHPExcel_Style();
        $sharedStyle3 = new PHPExcel_Style();
        $sharedStyle4 = new PHPExcel_Style();
        $sharedStyle5 = new PHPExcel_Style();
        $sharedStyle6 = new PHPExcel_Style();
        $sharedStyleWeekOld = new PHPExcel_Style();
        $sharedStyleWeekNew = new PHPExcel_Style();

        // Estilos
        $sharedStyle1->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'FFD700')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyle2->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'FFFFFF')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyle3->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'FFFFFF')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyle4->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'feddae')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyle5->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'FFFAF0')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyle6->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'F0E68C')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyleWeekOld->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'E8DDCB')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );
        $sharedStyleWeekNew->applyFromArray(
            array('fill' 	=> array(
                    'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                    'color'		=> array('argb' => 'CDB380')
                ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            )
        );

        $objPHPExcel->setActiveSheetIndex(0);

        $i = 3;

        // Distribuição Horizontal
        foreach ($rows as $record => $fields) {
            for ($x = 1; $x <= count($rows); $x++) {
                $colName = self::getColExcell($x);
                $colWeek = str_pad($x,2,"0",STR_PAD_LEFT);
                $objPHPExcel->getActiveSheet()->setCellValue($colName . $i, $fields["week" . $colWeek]);
            }
            $i++;
        }

        $posSize = count($rows);
        $colName = self::getColExcell($posSize);

        // Colunas Unidades, Ajustando Tamanho
        $objPHPExcel->getActiveSheet()->insertNewColumnBefore('A',2);
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(22);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(05);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);

        $i = 3;
        // Unidades, Posições
        foreach ($rows as $record => $fields) {
            $objPHPExcel->getActiveSheet()
                ->setCellValue("A$i", $fields["position"])
                ->setCellValue("B$i", $fields["contractorunit"]);
            $i++;
        }

        // Semanas Unidades
        for ($x = 3; $x < count($rows)+3; $x++) {
            $colName = self::getColExcell($x);
            $objPHPExcel->getActiveSheet()
                ->getRowDimension($x)
                ->setRowHeight(18);
            $objPHPExcel->getActiveSheet()
                ->setCellValue($colName . '2', $x-2)
                ->getColumnDimension($colName)->setWidth(5);
        }

        $objPHPExcel->getActiveSheet()
            ->setCellValue('A2','Semanas')
            ->mergeCells('A2:B2');

        $fontStyle1 = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 13,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );
        $fontStyle2 = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 13,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_LEFT
            )
        );
        $fontStyle3 = array(
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );
        $fontStyle4 = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 20,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );

        // Estilos
        $objPHPExcel->getActiveSheet()
            ->setSharedStyle($sharedStyle1, "A2:$colName" . 2)
            ->setSharedStyle($sharedStyle2, "A3:B" . ($posSize+2))
            ->setSharedStyle($sharedStyle3, "C3:$colName" . ($posSize+2))
            ->getStyle("A2:$colName" . 2)->applyFromArray($fontStyle1);

        // Destacando Ocorrência
        $objConditional = new PHPExcel_Style_Conditional();
        $objConditional->setConditionType(PHPExcel_Style_Conditional::CONDITION_CELLIS)
            ->setOperatorType(PHPExcel_Style_Conditional::OPERATOR_EQUAL)
            ->addCondition('1');
        $objConditional->getStyle()->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getEndColor()->setARGB('DBFC00');

        $conditionalStyles = $objPHPExcel->getActiveSheet()->getStyle("C3:$colName" . ($posSize+2))->getConditionalStyles();
        array_push($conditionalStyles, $objConditional);
        $objPHPExcel->getActiveSheet()->getStyle("C3:$colName" . ($posSize+2))->setConditionalStyles($conditionalStyles);

        $i = 1;
        $old = $i;
        $new = $i;

        // Destacando Corte na Unidade
        foreach ($rows as $record => $fields) {
            $contractorunit = $fields['contractorunit'];
            $positioncute = intval($fields['positioncute']);

            $tmp = isset($rows[$i]['contractorunit']) ? $rows[$i]['contractorunit'] : '';

            if($contractorunit !== $tmp) {

                // Alternando cores das linhas
                if($new % 2 == 0) {
                    $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyle6, "A" . ($old+2) . ":B" . ($i+2));
                    $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyle5, "C" . ($old+2) . ":$colName" . ($i+2));
                }

                // Merge nas Unidades
                $objPHPExcel->getActiveSheet()->mergeCells("A" . ($old+2) . ":A" . ($i+2));
                $objPHPExcel->getActiveSheet()->mergeCells("B" . ($old+2) . ":B" . ($i+2));

                $new++;
                $old = $i+1;
            }

            // Destaca Corte
            if($i == $positioncute) {
                $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyle4, "C" . ($positioncute+2) . ":$colName" . ($positioncute+2));
            }

            $i++;
        }

        // Destaca WeekOld, WeekNew
        $colWeekOld = self::getColExcell($weekold+2);
        $colWeekNew = self::getColExcell($weeknew+2);
        $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyleWeekOld, $colWeekOld . 3 . ":$colWeekOld" . ($posSize+2));
        $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyleWeekNew, $colWeekNew . 3 . ":$colWeekNew" . ($posSize+2));

        $objPHPExcel->getActiveSheet()
            ->setCellValue("A" . ($posSize+5),'Última')
            ->mergeCells("A" . ($posSize+5) . ":B" . ($posSize+5));
        $objPHPExcel->getActiveSheet()
            ->setCellValue("A" . ($posSize+6),'Primeira')
            ->mergeCells("A" . ($posSize+6) . ":B" . ($posSize+6));

        $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyleWeekOld, "C" . ($posSize+5));
        $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyleWeekNew, "C" . ($posSize+6));

        $objPHPExcel->getActiveSheet()->getStyle("A1:$colName" . 1)->applyFromArray($fontStyle1);

        $objPHPExcel->getActiveSheet()
            ->setCellValue("A1","Plantões Noturnos - $weekdaydesciption")
            ->mergeCells("A1:$colName" . 1);

        // Estilos
        $objPHPExcel->getActiveSheet()
            ->setSharedStyle($sharedStyle4, "A1:$colName" . 1)
            ->getStyle("A1:$colName" . 1)->applyFromArray($fontStyle4);

        $objPHPExcel->getActiveSheet()->getStyle("A2:A" . ($posSize+2))->applyFromArray($fontStyle1);
        $objPHPExcel->getActiveSheet()->getStyle("B2:B" . ($posSize+2))->applyFromArray($fontStyle2);
        $objPHPExcel->getActiveSheet()->getStyle("C3:$colName"  . ($posSize+2))->applyFromArray($fontStyle3);

        // Somas
        $colSum = count($rows)+2;
        $colNameSum = self::getColExcell($posSize+3);
        $colNamePos = self::getColExcell($posSize+2);

        // Linhas
        for ($x = 2; $x < count($rows)+3; $x++) {
            $objPHPExcel->getActiveSheet()->setCellValue($colNameSum . $x,"=SUM(C$x:$colNamePos" .$x. ")");
        }

        // Colunas
        for ($x = 3; $x < $colSum+1; $x++) {
            $colNameSum = self::getColExcell($x);
            $objPHPExcel->getActiveSheet()->setCellValue($colNameSum . ($colSum+1),"=SUM($colNameSum" . 3 . ":$colNameSum" . $colSum .")");
        }

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");

        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment;filename=MAPA.xlsx");
        header("Cache-Control: max-age=0");
        header("Cache-Control: max-age=1");
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
        header("Cache-Control: cache, must-revalidate");
        header("Pragma: public");

        $objWriter->save("php://output");
    }

}