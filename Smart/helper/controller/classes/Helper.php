<?php

namespace Helper\Controller\Classes;

/**
 * Classe construtora de helper´s da Smart framework
 *
 * @package Helper\Controller\Classes
 */
class Helper extends \Smart\Data\Proxy
{
    private $doc = '/Smart/helper/repository/';

    private $usr = "root";
    private $sch = "coopanest";
    private $pwd = "";
//    private $dns = "sqlsrv:server=(local);database=fgv";
    private $dns = "mysql:host=localhost;dbname=coopanest";

    public function __construct() {

        $link = array($this->dns, $this->usr, $this->pwd);

        parent::__construct( $link );

        $this->submit = $_POST;
    }

    public function selectTables() {
        $data = $this->submit;
        $start = $data['start'];
        $limit = $data['limit'];

        $sql = "SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = :TABLE_SCHEMA";

        try {

            $pdo = $this->prepare($sql);

            $pdo->bindValue(":TABLE_SCHEMA", $this->sch, \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        self::_setPage($start, $limit);
        return self::getResultToJson();
    }

    public function selectFields() {
        $data = $this->submit;
        $start = $data['start'];
        $limit = $data['limit'];
        $query = $data['query'];

        $sql = "SELECT ORDINAL_POSITION, COLUMN_NAME, COLUMN_DEFAULT, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE, 1 as HAS_POLICY, 0 as HAS_IGNORE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = :TABLE_SCHEMA AND TABLE_NAME = :TABLE_NAME";

        try {

            $pdo = $this->prepare($sql);

            $pdo->bindValue(":TABLE_NAME", $query, \PDO::PARAM_STR);
            $pdo->bindValue(":TABLE_SCHEMA", $this->sch, \PDO::PARAM_STR);

            $pdo->execute();
            $rows = $pdo->fetchAll();

            self::_setRows($rows);

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
        }

        self::_setPage($start, $limit);
        return self::getResultToJson();
    }

    public function createClasse() {

        $this->createModel();
        $this->createEvent();
        $this->createCache();
        $this->createCoach();
        $this->createExtJS();

        return self::getResultToJson();
    }

    private function createExtJS() {
        $root = $_SERVER["DOCUMENT_ROOT"] . $this->doc . "ExtJS/";
        $data = $this->submit;
        $rows = $data['rows'];
        $package = $data['package'];
        $namespace = $data['namespace'];
        $createmodel = $data['createmodel'];

        $list = explode('.',$package);

        $classname = end($list);
        $file = $classname . '.js';
        $storeId = strtolower($classname);

        $finded = array_search($classname,$list);
        unset($list[$finded]);

        if (!file_exists($root . "store/")) {
            mkdir($root . "store/" . implode("/", $list). "/", 0777, true);
        }

        $store = $root . "store/" . implode("/", $list). "/" . $file;
        $model = $root . "model/" . implode("/", $list). "/" . $file;

        // Criando Store
        $file = fopen($store, "w");
        fwrite($file, "Ext.define( '$namespace.store.$package', {\r\n");
        fwrite($file, "    extend: 'Smart.data.StoreBase',");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "    alias: 'store.$classname',");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "    storeId: '$storeId',");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "    url: 'business/Class/$storeId.php',");
        fwrite($file, "\r\n\r\n");

        if($createmodel == 'true') {
            fwrite($file, "    model: '$namespace.model.$package'");
        } else {
            $this->createField($file,$rows);
        }
        fwrite($file, "\r\n\r\n");

        fwrite($file, "});");

        // Criando Model (se solicitado)
        if($createmodel == 'true') {
            if (!file_exists($root . "model/")) {
                mkdir($root . "model/" . implode("/", $list). "/", 0777, true);
            }

            $file = fopen($model, "w");
            fwrite($file, "Ext.define( '$namespace.model.$package', {\r\n");
            fwrite($file, "    extend: 'Ext.data.Model',");
            fwrite($file, "\r\n\r\n");

            $this->createField($file,$rows);
            fwrite($file, "\r\n\r\n");

            fwrite($file, "});");
        }
    }

    private function createField(&$file, $rows) {
        $list = self::jsonToArray($rows);

        $i = 1;
        fwrite($file, "    fields: [\r\n");
        fwrite($file, "        {\r\n");

        // fields
        foreach ($list as $key => $value) {

            $value["HAS_IGNORE"] = strtolower($value["HAS_IGNORE"]) == '1' ? 'true' : 'false';

            if($value["HAS_IGNORE"] === 'true') continue;

            $columnName = strtolower($value["COLUMN_NAME"]);

            switch (self::_DATA_TYPE($value)) {
                case 'integer':
                    $columnType = 'int';
                    break;
                case 'string':
                    $columnType = 'auto';
                    break;
                default:
                    $columnType = $value;
            }

            fwrite($file, "            name: '$columnName',\r\n");
            fwrite($file, "            type: '$columnType'\r\n");

            if($i == count($list)) {
                fwrite($file, "        }\r\n");
            } else {
                fwrite($file, "        }, {\r\n");
            }

            $i++;
        }

        fwrite($file, "    ]");
    }

    private function createModel() {
        $root = $_SERVER["DOCUMENT_ROOT"] . $this->doc . "Model/";
        $data = $this->submit;
        $rows = $data['rows'];
        $classname = $data['model'];
        $listeners = $data['event'];
        $warehouse = $data['cache'];
        $namespace = $data['namespace'];

        $cache = str_replace(" ","","\\\ $namespace \\\ $warehouse");
        $event = str_replace(" ","","\\\ $namespace \\\ $listeners");

        $file = $classname .'.php';

        if (!file_exists($root)) {
            mkdir($root, 0777, true);
        }

        $file = fopen($root . $file, "w");
        fwrite($file, "<?php\r\n\r\n");

        fwrite($file, "namespace {$namespace}\\Model;");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "/**\r\n * \r\n * ");
        fwrite($file, '@Entity {"name":"'.$classname.'", "cache":"' . $cache. '", "event":"' . $event . '"}');

        fwrite($file, "\r\n */\r\n");

        fwrite($file, "class {$classname} extends \\Smart\\Data\\Model {\r\n\r\n");

        $list = self::jsonToArray($rows);

        // fields
        foreach ($list as $key => $value) {
            $value["HAS_IGNORE"] = strtolower($value["HAS_IGNORE"]) == '1' ? 'true' : 'false';

            if($value["HAS_IGNORE"] === 'true') continue;

            fwrite($file, "    /**\r\n");
            fwrite($file, $this->docPolicy($value));
            fwrite($file, "\r\n");
            fwrite($file, $this->docColumn($value));
            fwrite($file, "\r\n     */\r\n");
            fwrite($file, "    private $" . strtolower($value["COLUMN_NAME"]) . ";");
            fwrite($file, "\r\n\r\n");
        }

        // geters && seters
        foreach ($list as $key => $value) {
            $columnName = strtolower($value["COLUMN_NAME"]);
            $value["HAS_IGNORE"] = strtolower($value["HAS_IGNORE"]) == '1' ? 'true' : 'false';

            if($value["HAS_IGNORE"] === 'true') continue;

            // geters
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @return type " . self::_DATA_TYPE($value));
            fwrite($file, "\r\n     */\r\n");
            fwrite($file, "    public function get" . strtoupper($columnName[0]) . substr($columnName, 1) ."() {");
            fwrite($file, "\r\n");
            fwrite($file, '        return $this->' . $columnName . ';');
            fwrite($file, "\r\n");
            fwrite($file, "    }");
            fwrite($file, "\r\n\r\n");

            // seters
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param type $" . $columnName);
            fwrite($file, "\r\n");
            fwrite($file, "     * @return \\{$namespace}\\Model\\{$classname}");
            fwrite($file, "\r\n     */\r\n");
            fwrite($file, "    public function set" . strtoupper($columnName[0]) . substr($columnName, 1) ."($".$columnName.") {");
            fwrite($file, "\r\n");
            fwrite($file, '        $this->' . $columnName . ' = $' . "{$columnName};");
            fwrite($file, "\r\n");
            fwrite($file, '        return $this;');
            fwrite($file, "\r\n");
            fwrite($file, "    }");
            fwrite($file, "\r\n\r\n");
        }

        fwrite($file, "}");
    }

    private function createEvent() {
        $root = $_SERVER["DOCUMENT_ROOT"] . $this->doc;
        $data = $this->submit;
        $classname = $data['model'];
        $listeners = $data['event'];
        $namespace = $data['namespace'];

        $l = explode('\\',$listeners);

        $root .= self::getFore($l) . "/";

        $file = $classname .'.php';

        if (!file_exists($root)) {
            mkdir($root, 0777, true);
        }

        $file = fopen($root . $file, "w");
        fwrite($file, "<?php\r\n\r\n");

        fwrite($file, "namespace {$namespace}\\" . self::getFore($l) . ";");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "class " . self::getLast($l) . " extends \\Smart\\Data\\Event {\r\n\r\n");

        // Insert
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param \\{$namespace}\\Model\\{$classname}" . ' $model' . "\r\n");
            fwrite($file, "     */\r\n");
            fwrite($file, "    public function preInsert( \\{$namespace}\\Model\\{$classname} &" . '$model' . " ) {\r\n\r\n");
            fwrite($file, "    }\r\n\r\n");
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param \\{$namespace}\\Model\\{$classname}" . ' $model' . "\r\n");
            fwrite($file, "     */\r\n");
            fwrite($file, "    public function posInsert( \\{$namespace}\\Model\\{$classname} &" . '$model' . " ) {\r\n\r\n");
            fwrite($file, "    }\r\n\r\n");

        // Update
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param \\{$namespace}\\Model\\{$classname}" . ' $model' . "\r\n");
            fwrite($file, "     */\r\n");
            fwrite($file, "    public function preUpdate( \\{$namespace}\\Model\\{$classname} &" . '$model' . " ) {\r\n\r\n");
            fwrite($file, "    }\r\n\r\n");
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param \\{$namespace}\\Model\\{$classname}" . ' $model' . "\r\n");
            fwrite($file, "     */\r\n");
            fwrite($file, "    public function posUpdate( \\{$namespace}\\Model\\{$classname} &" . '$model' . " ) {\r\n\r\n");
            fwrite($file, "    }\r\n\r\n");

        // Delete
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param \\{$namespace}\\Model\\{$classname}" . ' $model' . "\r\n");
            fwrite($file, "     */\r\n");
            fwrite($file, "    public function preDelete( \\{$namespace}\\Model\\{$classname} &" . '$model' . " ) {\r\n\r\n");
            fwrite($file, "    }\r\n\r\n");
            fwrite($file, "    /**\r\n");
            fwrite($file, "     * @param \\{$namespace}\\Model\\{$classname}" . ' $model' . "\r\n");
            fwrite($file, "     */\r\n");
            fwrite($file, "    public function posDelete( \\{$namespace}\\Model\\{$classname} &" . '$model' . " ) {\r\n\r\n");
            fwrite($file, "    }\r\n\r\n");

        fwrite($file, "}");
    }

    private function createCache() {
        $root = $_SERVER["DOCUMENT_ROOT"] . $this->doc;
        $data = $this->submit;
        $classname = $data['model'];
        $warehouse = $data['cache'];
        $namespace = $data['namespace'];

        $w = explode('\\',$warehouse);

        $root .= self::getFore($w) . "/";

        $file = $classname .'.php';

        if (!file_exists($root)) {
            mkdir($root, 0777, true);
        }

        $file = fopen($root . $file, "w");
        fwrite($file, "<?php\r\n\r\n");

        fwrite($file, "namespace {$namespace}\\" . self::getFore($w) . ";");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "use {$namespace}\\Model\\{$classname} as Model;");

        fwrite($file, "\r\n\r\n");

        fwrite($file, "class " . self::getLast($w) . " extends \\Smart\\Data\\Cache {");
        fwrite($file, "\r\n\r\n");
        fwrite($file, "}");
    }

    private function createCoach() {
        $root = $_SERVER["DOCUMENT_ROOT"] . $this->doc . "Coach/";
        $data = $this->submit;
        $classname = $data['model'];
        $namespace = $data['namespace'];

        $file = $classname .'.php';

        if (!file_exists($root)) {
            mkdir($root, 0777, true);
        }

        $file = fopen($root . $file, "w");
        fwrite($file, "<?php\r\n\r\n");

        fwrite($file, "namespace {$namespace}\\Coach;");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "class {$classname} extends \\Smart\\Common\\Coach {\r\n\r\n");

        fwrite($file, "    /**\r\n");
        fwrite($file, "     * @var \\{$namespace}\\Model\\{$classname} " . '$model' . "\r\n" );
        fwrite($file, "     */\r\n");
        fwrite($file, '    public $model = ' . "'\\{$namespace}\\Model\\{$classname}';");
        fwrite($file, "\r\n\r\n");

        fwrite($file, "}");

        $root = $_SERVER["DOCUMENT_ROOT"] . $this->doc . "Class/";

        $file = $classname .'.php';

        if (!file_exists($root)) {
            mkdir($root, 0777, true);
        }

        $file = fopen($root . $file, "w");
        fwrite($file, "<?php\r\n\r\n");

        fwrite($file, "require_once '../../vendor/autoload.php';");
        fwrite($file, "\r\n\r\n");

        fwrite($file, '$object = new ' . "\\{$namespace}\\Coach\\{$classname}();");
        fwrite($file, "\r\n\r\n");

        fwrite($file, 'echo $object->callAction();');

    }

    private function docPolicy($value) {
        $isId = strtolower($value["COLUMN_NAME"]) === "id";
        $docDescription = '     * @Policy {"nullable":' . self::_IS_NULLABLE($value) . self::_CHARACTER_MAXIMUM_LENGTH($value) . '}';
        return $isId ? '     * @Policy {"nullable":' . self::_IS_NULLABLE($value) . '}' : $docDescription;
    }

    private function docColumn($value) {
        $docDescription = '     * @Column {"description":"'.self::_COMMENT_DESCRIPTION($value).'", '. self::_STRATEGY_TYPE($value) .'"type":"'.self::_DATA_TYPE($value).'", "policy":'.self::_HAS_POLICY($value).'}';
        return $docDescription;
    }

    private static function _DATA_TYPE (array $array) {
        $value = $array["DATA_TYPE"];

        switch ($value) {
            case 'int':
                $value = 'integer';
                break;
            case 'bit':
                $value = 'boolean';
                break;
            case 'date':
                $value = 'date';
                break;
            case 'time':
                $value = 'time';
                break;
            case 'varchar':
                $value = 'string';
                break;
            default:
                $value = 'string';
        }

        return $value;
    }

    private static function _HAS_IGNORE (array $array) {
        $value = $array["HAS_IGNORE"];

        return ($value == '0' || $value == 'false' ) ? 'false' : 'true';
    }

    private static function _HAS_POLICY (array $array) {
        $value = $array["HAS_POLICY"];

        return ($value == '0' || $value == 'false' ) ? 'false' : 'true';
    }

    private static function _IS_NULLABLE (array $array) {
        $value = $array["IS_NULLABLE"];

        return $value == 'NO' ? 'false' : 'true';
    }

    private static function _STRATEGY_TYPE (array $array) {
        $value = isset($array["STRATEGY_TYPE"]) ?  '"strategy":"' . $array["STRATEGY_TYPE"] . '", ': '';

        return $value;
    }

    private static function _COLUMN_DEFAULT (array $array) {
        $value = $array["COLUMN_DEFAULT"];

        return $value;
    }

    private static function _COMMENT_DESCRIPTION (array $array) {
        $value = isset($array["COMMENT_DESCRIPTION"]) ?  $array["COMMENT_DESCRIPTION"] : '';

        return $value;
    }

    private static function _CHARACTER_MAXIMUM_LENGTH (array $array) {
        $value = $array["CHARACTER_MAXIMUM_LENGTH"];

        return $value ? ', "length":' . $value : '';
    }

    /**
     * Chama o método armazenado no indice <code>action<code/>
     *
     * @return json <code>$result<code/>
     */
    public function callAction() {
        $action = $this->submit['action'];
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }
}