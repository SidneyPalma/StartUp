<?php

require_once '../../vendor/autoload.php';
//
//$_POST['action'] = 'select';
//$_POST['method'] = 'selectCode';
//$_POST['naturalpersonid'] = 351;

$object = new \AppAnest\Coach\naturalpersondistribution();

echo $object->callAction();