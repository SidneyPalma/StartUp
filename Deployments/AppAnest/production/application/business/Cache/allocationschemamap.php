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

        // Obter novo
        $sqlSchemaWeek = "select schemaweek from allocationschema where id = :id";

        $pdo = $proxy->prepare($sqlSchemaWeek);

        $pdo->bindValue(":id", $id, \PDO::PARAM_INT);

        $pdo->execute();
        $json = self::encodeUTF8($pdo->fetchAll());

        $rows = self::jsonToArray($json[0]["schemaweek"]);

        $position = 0;
        $rownumber = 0;
        $contractorunitid = '';

        // Construindo a Lista de Unidades
        foreach ($rows as $record) {
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
            $pdo = $this->getStore()->getProxy()->prepare("select schemamap from allocationschemamap where id = :id");

            $pdo->bindValue(":id", $id, \PDO::PARAM_INT);

            $pdo->execute();
            $day = self::encodeUTF8($pdo->fetchAll());
            $schemamap = $day[0]["schemamap"];
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

        $sharedStyle1->applyFromArray(
            array('fill' 	=> array(
                'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                'color'		=> array('argb' => 'F2E191')
            ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            ));
        $sharedStyle2->applyFromArray(
            array('fill' 	=> array(
                'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                'color'		=> array('argb' => 'FBEDA5')
            ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            ));
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
            ));
        $sharedStyle4->applyFromArray(
            array('fill' 	=> array(
                'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
                'color'		=> array('argb' => 'BDFC00')
            ),
                'borders' => array(
                    'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'right'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'left'		=> array('style' => PHPExcel_Style_Border::BORDER_THIN),
                    'top'       => array('style' => PHPExcel_Style_Border::BORDER_THIN)
                )
            ));

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

        //!($x % 2) ? "par" : "impar";

        $posSize = count($rows);
        $colName = self::getColExcell($posSize);

        // Colunas Unidades, Ajustando Tamanho
        $objPHPExcel->getActiveSheet()->insertNewColumnBefore('A',2);
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(22);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(05);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(15);

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
                ->setCellValue($colName . '2', $x-2)
                ->getColumnDimension($colName)->setWidth(5);
        }

        $objPHPExcel->getActiveSheet()
            ->setCellValue('A2','Semana=>')
            ->mergeCells('A2:B2');

        $fontStyle = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 14,
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
            ->getStyle("A2:$colName" . 2)->applyFromArray($fontStyle);

        $objPHPExcel->getActiveSheet()->getStyle("A2:A" . ($posSize+2))->applyFromArray($fontStyle);

        // Destacando Posiçao
        $objConditional = new PHPExcel_Style_Conditional();
        $objConditional->setConditionType(PHPExcel_Style_Conditional::CONDITION_CELLIS)
            ->setOperatorType(PHPExcel_Style_Conditional::OPERATOR_EQUAL)
            ->addCondition('1');
        $objConditional->getStyle()->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getEndColor()->setARGB('FFED4F');

        $conditionalStyles = $objPHPExcel->getActiveSheet()->getStyle("C3:$colName" . ($posSize+2))->getConditionalStyles();
        array_push($conditionalStyles, $objConditional);
        $objPHPExcel->getActiveSheet()->getStyle("C3:$colName" . ($posSize+2))->setConditionalStyles($conditionalStyles);


        $i = 1;
        // Destacando Corte
        foreach ($rows as $record => $fields) {
            $positioncute = intval($fields['positioncute']);
            if($i == $positioncute) {
                $objPHPExcel->getActiveSheet()
                    ->setSharedStyle($sharedStyle4, "C" . ($positioncute+2) . ":$colName" . ($positioncute+2));
            }
            $i++;
        }

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

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