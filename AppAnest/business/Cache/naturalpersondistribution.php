<?php

namespace AppAnest\Cache;

use PHPExcel_Cell;
use PHPExcel_IOFactory;
use PHPExcel_Reader_Excel2007;
use PHPExcel_Reader_Excel2005;
use PHPExcel_CachedObjectStorage_Memory;

use AppAnest\Model\naturalpersondistribution as Model;

class naturalpersondistribution extends \Smart\Data\Cache {

    public function selectCode(array $data) {
        $query = $data['query'];
        $fixed = array("sat", "sun");
        $proxy = $this->getStore()->getProxy();

        $sqlShift = "
            select
                etl.code as shift,
                etl.description as shiftdescription
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = 'shift'

            union all

            select
                'P' as shift,
                'Posição' as shiftdescription";

        $sqlWeekDay = "
            select
                etl.code as weekday
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = 'weekday'";

        $sqlDistribution = "
            select
                npd.id,
                :naturalpersonid as naturalpersonid,
                npd.contractorunitid,
                p.shortname as contractorunitdescription,
                npd.shift,
                npd.weekday,
                npd.position
            from
                naturalpersondistribution npd
                left join person p on ( p.id = npd.contractorunitid )
            where npd.naturalpersonid = :naturalpersonid

            union all

            select
                null as id,
                :naturalpersonid as naturalpersonid,
                null as contractorunitid,
                null as contractorunitdescription,
                etl.code as shift,
                null as weekday,
                null as position
            from
                enumtype et
                inner join enumtypelist etl on ( etl.enumtypeid = et.id )
            where et.name = 'shift'

            union all

            select
                null as id,
                :naturalpersonid as naturalpersonid,
                null as contractorunitid,
                null as contractorunitdescription,
                'P' as shift,
                null as weekday,
                null as position";

        try {
            $pdo = $proxy->prepare($sqlDistribution);

            $pdo->bindValue(":naturalpersonid", $query, \PDO::PARAM_INT);

            $pdo->execute();
            $distributionRows = $pdo->fetchAll();
            $shiftRows = $proxy->query($sqlShift)->fetchAll();
            $weekdayRows = $proxy->query($sqlWeekDay)->fetchAll();

            $index = 0;
            $rows = array();

            // filtrar Turno
            if (isset($data['entry'])) {
                $list = array();
                $entry = $data['entry'];
                $key = array_search($entry, array_column($shiftRows, 'shift'));
                $list[0] = $shiftRows[$key];
                $shiftRows = $list;
            }

            $shiftOn = '<div style="color: rgba(255, 99, 71, 1); font-size: 16px; text-align: center;"><span style="cursor: pointer;"><i class="icon-ok-squared"></i></span></div>';
            $shiftOf = '<div style="color: rgba(87, 87, 87, .3); font-size: 16px; text-align: center;"><span style="cursor: pointer;"><i class="icon-ok-squared"></i></span></div>';

            // Turno do dia
            foreach ($shiftRows as $recShift) {

                $shift = $recShift["shift"];
                $shiftdescription = $recShift["shiftdescription"];

                $rows[$index]['id'] = $index +1;
                $rows[$index]["shift"] = $shift;
                $rows[$index]["shiftdescription"] = $shiftdescription;

                // Dia da semana
                foreach ($weekdayRows as $recWeekday) {
                    $weekday = $recWeekday["weekday"];
                    $rows[$index]["$weekday".'id'] = null;
                    $rows[$index]["$weekday".'description'] = (($shift == 'N') && (!in_array($weekday, $fixed))) ? $shiftOf : null;

                    // Valor do Dia
                    foreach ($distributionRows as $recDistribution) {
                        $id = $recDistribution["id"];
                        $naturalpersonid = intval($query);
                        $position = $recDistribution["position"];
                        $contractorunitid = $recDistribution["contractorunitid"];
                        $contractorunitdescription = $recDistribution["contractorunitdescription"];

                        $rows[$index]["naturalpersonid"] = $naturalpersonid;

                        if($shift == $recDistribution["shift"] && $weekday == $recDistribution["weekday"]) {
                            $rows[$index]["$weekday".'id'] = $id;
                            $rows[$index][$weekday] = $contractorunitid;
                            $rows[$index]["$weekday".'description'] = $contractorunitdescription;

                            if(($shift == 'N') && (!in_array($weekday, $fixed))) {
                                $rows[$index]["$weekday".'description'] = strlen($id) != 0 ? $shiftOn : $shiftOf;
                            }
                            if($shift == 'P') {
                                $rows[$index]["$weekday".'description'] = $position;
                            }
                        }
                    }
                }

                $index++;
            }

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        return self::getResultToJson();
    }

    public function getDistribution() {
        $proxy = $this->getStore()->getProxy();
        $objPHPExcel = PHPExcel_IOFactory::load("../../resources/template/DistribuicaoContratoEscala.xlsx");

        $sql = "
            select
                p.id,
                lpad(np.registrationid,3,'0') as registration,
                upper(p.shortname) as naturalperson,
                npd.shift,
                npd.weekday,
                ctup.shortname as contractorunit,
                case npd.shift
                    when 'N' then ( select concat('Posição: ',lpad(position,3,'0')) from naturalpersondistribution where weekday = npd.weekday and shift = 'P' and naturalpersonid = npd.naturalpersonid )
                    else null
                end as position
            from
                person p
                inner join naturalperson np on ( np.id = p.id )
                inner join naturalpersondistribution npd on ( npd.naturalpersonid = np.id and shift != 'P' )
                left join contractorunit ctu on ( ctu.id = npd.contractorunitid )
                left join person ctup on ( ctup.id = ctu.id )
            order by np.registrationid, npd.shift";

        $rows = $proxy->query($sql)->fetchAll();

        $rows = self::encodeUTF8($rows);

        $i = 4;
        $distribution = array();
        $weekdaysList = array('mon'=>'E','tue'=>'F','wed'=>'G','thu'=>'H','fri'=>'I','sat'=>'J','sun'=>'K');


        while(list(, $row) = each($rows)) {
            extract($row);
            $distribution[$registration][$shift]['shift'] = $shift;
            $distribution[$registration][$shift]['registration'] = $registration;
            $distribution[$registration][$shift]['naturalperson'] = $naturalperson;
            $distribution[$registration][$shift]['weekday'][$weekdaysList[$weekday]] = ($shift == 'D' ? $contractorunit : $position);
        }

        foreach ($distribution as $records => $fields) {
            foreach ($fields as $key => $val) {
                $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue("B$i", $val['registration'])
                    ->setCellValue("C$i", $val['naturalperson'])
                    ->setCellValue("D$i", $val['shift'])
                    ->setCellValue("E$i", isset($val['weekday']['E']) ? $val['weekday']['E'] : '')
                    ->setCellValue("F$i", isset($val['weekday']['F']) ? $val['weekday']['F'] : '')
                    ->setCellValue("G$i", isset($val['weekday']['G']) ? $val['weekday']['G'] : '')
                    ->setCellValue("H$i", isset($val['weekday']['H']) ? $val['weekday']['H'] : '')
                    ->setCellValue("I$i", isset($val['weekday']['I']) ? $val['weekday']['I'] : '')
                    ->setCellValue("J$i", isset($val['weekday']['J']) ? $val['weekday']['J'] : '')
                    ->setCellValue("K$i", isset($val['weekday']['K']) ? $val['weekday']['K'] : '');
                $i++;
            }
        }

        $objPHPExcel->getActiveSheet()->setTitle("Distribuicao");
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel5");

        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment;filename=DistribuicaoContratoEscala.xls");
        header("Cache-Control: max-age=0");
        header("Cache-Control: max-age=1");
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
        header("Cache-Control: cache, must-revalidate");
        header("Pragma: public");

        $objWriter->save("php://output");
    }

}