<?php
$json = json_decode('{"id":1,"shift":"D","shiftdescription":"Diurno","sunid":null,"sundescription":null,"naturalpersonid":"351","monid":"1","mondescription":"Fajardo","mon":"46","tueid":null,"tuedescription":null,"wedid":"4","weddescription":"Remoção","wed":"52","thuid":"3","thudescription":"28 de Agosto","thu":"31","friid":null,"fridescription":null,"satid":null,"satdescription":"CAMI-Alvorada","contractorunitid":null,"sun":null,"tue":null,"fri":null,"sat":"47"}');

foreach ($json as $field => $value) {
    echo $field;
}
