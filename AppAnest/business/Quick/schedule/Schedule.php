<?php

namespace AppAnest\Quick\schedule;

use Smart\Utils\Session;
use AppAnest\Setup\Start;

use PHPExcel;
use PHPExcel_Cell;
use PHPExcel_Style;
use PHPExcel_Worksheet;
use PHPExcel_IOFactory;
use PHPExcel_Style_Fill;
use PHPExcel_Style_Color;
use PHPExcel_Style_Border;
use PHPExcel_Style_Alignment;
use PHPExcel_Reader_Excel2007;
use PHPExcel_Reader_Excel2005;
use PHPExcel_Style_Conditional;
use PHPExcel_Worksheet_MemoryDrawing;
use PHPExcel_Worksheet_ColumnDimension;
use PHPExcel_CachedObjectStorage_Memory;

class Schedule extends \Smart\Data\Proxy {
    /**
     * Estrutura contendo os dias da Semana
     *
     * @var array
     */
    private $daysweek = array(
        'dayscode'=>array(1,2,3,4,5,6,7),
        'daysname'=>array(1=>'sun',2=>'mon',3=>'tue',4=>'wed',5=>'thu',6=>'fri',7=>'sat')
    );

    private $sqlUnique = "
        select
            sm.contractorunitid,
            c.shortname as contractorunit,
            tp.shift,
            tp.subunit,
            tp.position,
            (
				select
					concat(pp.ddd,' ',pp.phonenumber)
                from
					personphone pp
				where pp.personid = cu.id
				  and pp.isdefault = 1
                limit 1
            ) as phonenumber
        from
            schedulingmonthly sm
            inner join contractorunit cu on ( cu.id = sm.contractorunitid )
            inner join schedulingperiod sp on ( sp.id = sm.schedulingperiodid )
            inner join _tablename_ tp on ( tp.schedulingmonthlyid = sm.id )
            inner join person c on ( c.id = sm.contractorunitid )
            left join person n on ( n.id = tp.naturalpersonid )
        where sp.id = :period
          and sm.dutydate between :dateof and :dateto
        group by cu.position, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

    private $sqlSelect = "
            select
                tp.id,
                sm.dutydate,
                sm.contractorunitid,
                c.shortname as contractorunit,
                substring(lower(dayname(sm.dutydate)),1,3) as dutyname,
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
                inner join _tablename_ tp on ( tp.schedulingmonthlyid = sm.id )
                inner join person c on ( c.id = sm.contractorunitid )
                left join person n on ( n.id = tp.naturalpersonid )
            where sp.id = :period
              and sm.dutydate between :dateof and :dateto
            order by sm.dutydate, cu.position, sm.contractorunitid, tp.shift, tp.subunit, tp.position";

    public function callAction() {
        $action = $this->post->action;
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }

    public function __construct() {
        $this->post = (object)$_REQUEST;

        $link = array(Start::getDataBase(), Start::getUserName(), Start::getPassWord());

        parent::__construct( $link );

        ini_set('max_execution_time', 600); // 10 minutos
    }

    private function selectView (array $unique, array $select) {
        $n = 1;
        $daysname = $this->daysweek['daysname'];

        foreach($daysname as $key=>$d) {
            $i = 0;
            $j = 0;
            $s = self::searchArray($select,'dutyname',$d);

            $contractorunitid = '';

            foreach($unique as $u) {
                $b = 0;
                $search = $s;
                $search = self::searchArray($search,'contractorunitid',$u['contractorunitid']);
                $search = self::searchArray($search,'shift',$u['shift']);
                $search = self::searchArray($search,'subunit',$u['subunit']);
                $search = self::searchArray($search,'position',$u['position']);

                if($contractorunitid != $u['contractorunitid']) {
                    $j++;
                    $b = 1;
                }

                $unique[$i]['id'] = $n;
                $unique[$i]['bordertop'] = $b;
                $unique[$i]['rownumber'] = $j;
                $unique[$i][$d.'description'] = '...';

                if(isset($search[0])) {
                    $unique[$i][$d] = $search[0]['id'];
                }

                $contractorunitid = $u['contractorunitid'];

                if(isset($search[0]['dutydate'])) {
                    $unique[$i][$d.'dutydate'] = $search[0]['dutydate'];
                }
                if(isset($search[0]['allocationschema'])) {
                    $unique[$i][$d.'schema'] = $search[0]['allocationschema'];
                }
                if(isset($search[0]['naturalperson'])) {
                    $unique[$i][$d.'description'] = $search[0]['naturalperson'];
                }

                $i++;
                $n++;
            }
        }

        return $unique;
    }

    public function selectSchedule () {
        $period = $this->post->period;

        $sqlPeriod = "
            select
                @dutydate := concat(lpad(year(sp.periodof),4,'0'),'-',lpad(month(sp.periodof),2,'0'),'-',lpad(row+1,2,'0')) as dutydate,
                SUBDATE(@dutydate, WEEKDAY(@dutydate)) as dateof,
                DATE(SUBDATE(@dutydate, WEEKDAY(@dutydate)) + INTERVAL (8 - DAYOFWEEK(SUBDATE(@dutydate, WEEKDAY(@dutydate)))) DAY) as dateto,
                if(sp.status = 'P', 'schedulingmonthlypartners', 'tmp_turningmonthly') as _tablename_
            from
                ( select
                    @row := @row + 1 as row
                  from
                    ( select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6 ) t1,
                    ( select 0 union all select 1 union all select 3 union all select 4 union all select 5 union all select 6 ) t2,
                    ( select @row:=-1 ) t3 limit 31
                ) b,
                schedulingperiod sp
            where sp.id = :period
              and date_add(sp.periodof, interval row day) between sp.periodof and sp.periodto
			group by dateof, dateto";

        $pdo = $this->prepare($sqlPeriod);
        $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
        $pdo->execute();
        $data = $pdo->fetchAll();

        $objPHPExcel = new PHPExcel();

        $week = 0;
        foreach($data as $list) {
            $dateOf = $list['dateof'];
            $dateTo = $list['dateto'];
            $tablename = $list['_tablename_'];

            $sqlUnique = str_replace("_tablename_", $tablename, $this->sqlUnique);
            $pdo = $this->prepare($sqlUnique);
            $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
            $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
            $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
            $pdo->execute();
            $unique = $pdo->fetchAll();

            $sqlSelect = str_replace("_tablename_", $tablename, $this->sqlSelect);
            $pdo = $this->prepare($sqlSelect);
            $pdo->bindValue(":dateof", $dateOf, \PDO::PARAM_STR);
            $pdo->bindValue(":dateto", $dateTo, \PDO::PARAM_STR);
            $pdo->bindValue(":period", $period, \PDO::PARAM_INT);
            $pdo->execute();
            $select = $pdo->fetchAll();

            $rows = self::encodeUTF8($this->selectView($unique,$select));

            $this->setScheduleWeek($objPHPExcel,$rows,$week,$dateOf);

            $week++;
        }

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");

        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment;filename=EscalaMensal.xlsx");
        header("Cache-Control: max-age=0");
        header("Cache-Control: max-age=1");
        header("Expires: Mon, 11 Apr 1972 05:00:00 GMT");
        header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
        header("Cache-Control: cache, must-revalidate");
        header("Pragma: public");

        $objWriter->save("php://output");

    }

    private function setScheduleWeek (&$objPHPExcel,$rows,$week,$dateof) {
        $featured = array('010','012','013');
        $daysname = $this->daysweek['daysname'];
        $index = str_pad(($week+1),2,"0",STR_PAD_LEFT);
        $colls = array(
            "mon"=>"D", "tue"=>"E", "wed"=>"F",
            "thu"=>"G", "fri"=>"H",
            "sat"=>"I", "sun"=>"J"
        );

        $objPHPExcel->createSheet(NULL);
        $objPHPExcel->setActiveSheetIndex($week);
        $objPHPExcel->getActiveSheet()->setTitle("SEMANA$index");

        $sharedStyle1 = new PHPExcel_Style();
        $sharedStyle2 = new PHPExcel_Style();
        $sharedStyle3 = new PHPExcel_Style();
        $sharedStyle4 = new PHPExcel_Style();
        $sharedStyle5 = new PHPExcel_Style();
        $sharedStyle6 = new PHPExcel_Style();

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

        $fontStyle1 = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 8,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );
        $fontStyle2 = array(
            'font'  => array(
                'bold'  => false,
                'color' => array('rgb' => '033649'),
                'size'  => 7,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );
        $fontStyle3 = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 9,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );
        $fontStyle4 = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '033649'),
                'size'  => 10,
                'name'  => 'Calibri'
            ),
            'alignment' => array(
                'vertical'      => PHPExcel_Style_Alignment::VERTICAL_CENTER,
                'horizontal'    => PHPExcel_Style_Alignment::HORIZONTAL_CENTER
            )
        );

        // Colunas Unidades, Ajustando Tamanho
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(14);

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(18);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(1.8);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(1.8);

        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(12);

        $day = new \DateTime($dateof);
        $mon = $day->format("d");

        $day->modify('+ 1 days');
        $tue = $day->format("d");

        $day->modify('+ 1 days');
        $wed = $day->format("d");

        $day->modify('+ 1 days');
        $thu = $day->format("d");

        $day->modify('+ 1 days');
        $fri = $day->format("d");

        $day->modify('+ 1 days');
        $sat = $day->format("d");

        $day->modify('+ 1 days');
        $sun = $day->format("d");

        $objPHPExcel->getActiveSheet()
            ->setCellValue("A1","LOCAL")
            ->setCellValue("D1","SEGUNDA - $mon")
            ->setCellValue("E1","TERCA - $tue")
            ->setCellValue("F1","QUARTA - $wed")
            ->setCellValue("G1","QUINTA - $thu")
            ->setCellValue("H1","SEXTA - $fri")
            ->setCellValue("I1","SABADO - $sat")
            ->setCellValue("J1","DOMINGO - $sun");

        $objPHPExcel->getActiveSheet()
            ->setCellValue('B1','LG')
            ->mergeCells('B1:C1');

        $i = 1;

        $old = $i;
        $new = $i;

        $schedule_sun = imagecreatefrompng('../../../resources/images/appanest/schedule_sun.png');
        $schedule_moon = imagecreatefrompng('../../../resources/images/appanest/schedule_moon.png');
        $schedule_heart = imagecreatefrompng('../../../resources/images/appanest/schedule_heart.png');
        $schedule_brain = imagecreatefrompng('../../../resources/images/appanest/schedule_brain.png');

        imagealphablending($schedule_sun, false);
        imagesavealpha($schedule_sun, true);

        imagealphablending($schedule_moon, false);
        imagesavealpha($schedule_moon, true);

        imagealphablending($schedule_heart, false);
        imagesavealpha($schedule_heart, true);

        imagealphablending($schedule_brain, false);
        imagesavealpha($schedule_brain, true);

        foreach($rows as $record) {
            $j = $i+1;
            $phonenumber = $record['phonenumber'];
            $contractorunit = $record['contractorunit'];

            $objPHPExcel->getActiveSheet()->getRowDimension($j)->setRowHeight(10);

            $contractorunitLabel = strlen($phonenumber) != 0 ? "$contractorunit\n$phonenumber" : $contractorunit;

            $objPHPExcel->getActiveSheet()
                ->setCellValue("A$j",$contractorunitLabel)
                ->setCellValue("D$j",$record['mondescription'])
                ->setCellValue("E$j",$record['tuedescription'])
                ->setCellValue("F$j",$record['weddescription'])
                ->setCellValue("G$j",$record['thudescription'])
                ->setCellValue("H$j",$record['fridescription'])
                ->setCellValue("I$j",$record['satdescription'])
                ->setCellValue("J$j",$record['sundescription']);

            $tmp = isset($rows[$i]['contractorunit']) ? $rows[$i]['contractorunit'] : '';

            $objPHPExcel->getActiveSheet()
                ->setSharedStyle($sharedStyle2, "A$j:J$j")
                ->getStyle("D$j:J$j")->applyFromArray($fontStyle2);

            // Diurnos
            if($record['shift'] == 'D') {
                $objDrawing = new PHPExcel_Worksheet_MemoryDrawing();
                $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                $objDrawing->setImageResource($schedule_sun);
                $objDrawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_PNG);
                $objDrawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_PNG);
                $objDrawing->setHeight(13);
                $objDrawing->getOffsetX(20);
                $objDrawing->getOffsetY(20);
                $objDrawing->setCoordinates("B$j");

                unset($objDrawing);
            }

            // Turno
            $objPHPExcel->getActiveSheet()
                ->setSharedStyle($sharedStyle5, "B$j:C$j");

            // Noturnos
            if($record['shift'] == 'N') {
                $objPHPExcel->getActiveSheet()
                    ->setSharedStyle($sharedStyle5, "A$j:J$j")
                    ->setSharedStyle($sharedStyle4, "B$j")
                    ->getStyle("D$j:J$j")->applyFromArray($fontStyle2);

                $objDrawing = new PHPExcel_Worksheet_MemoryDrawing();
                $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                $objDrawing->setImageResource($schedule_moon);
                $objDrawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_PNG);
                $objDrawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_PNG);
                $objDrawing->setHeight(13);
                $objDrawing->getOffsetX(20);
                $objDrawing->getOffsetY(20);
                $objDrawing->setCoordinates("B$j");

                unset($objDrawing);
            }

            if($record['subunit'] == '003') {
                $objDrawing = new PHPExcel_Worksheet_MemoryDrawing();
                $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                $objDrawing->setImageResource($schedule_heart);
                $objDrawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_PNG);
                $objDrawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_PNG);
                $objDrawing->setHeight(13);
                $objDrawing->getOffsetX(20);
                $objDrawing->getOffsetY(20);
                $objDrawing->setCoordinates("C$j");

                unset($objDrawing);
            }

            if($record['subunit'] == '005') {
                $objDrawing = new PHPExcel_Worksheet_MemoryDrawing();
                $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                $objDrawing->setImageResource($schedule_brain);
                $objDrawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_PNG);
                $objDrawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_PNG);
                $objDrawing->setHeight(13);
                $objDrawing->getOffsetX(20);
                $objDrawing->getOffsetY(20);
                $objDrawing->setCoordinates("C$j");

                unset($objDrawing);
            }

            // Merge nas Unidades
            if($contractorunit !== $tmp) {

                $cells = "A" . ($old+1) . ":A" . ($i+1);

                // Alternando cores das linhas
                if($new % 2 == 0) {
                    $objPHPExcel->getActiveSheet()->setSharedStyle($sharedStyle5, $cells);
                }

                $objPHPExcel->getActiveSheet()
                    ->mergeCells($cells)
                    ->getStyle($cells)
                    ->applyFromArray($fontStyle4)
                    ->getAlignment()
                    ->setWrapText(true);

                $new++;
                $old = $i+1;

            }

            // Destacar turnos especiais ($featured(array)))
            foreach($daysname as $key=>$d) {
                $schema = $d . "schema";
                if(isset($record[$schema]) && in_array($record[$schema], $featured)) {
                    $coll = $colls[$d];
                    $objPHPExcel->getActiveSheet()
                        ->getStyle($coll . $j)->applyFromArray($fontStyle3);
                }
            }

            // Merge Colunas LG
            $objPHPExcel->getActiveSheet()
                ->mergeCells("B$j:C$j");

            $i++;
        }

        // Estilos
        $objPHPExcel->getActiveSheet()
            ->setSharedStyle($sharedStyle1, "A$j")
            ->setSharedStyle($sharedStyle1, "A1:J1")
            ->getStyle("A1:J1")->applyFromArray($fontStyle1);
    }

}