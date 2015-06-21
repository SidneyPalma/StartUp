<?php

namespace Smart\Common\Traits;

/**
 * TvalidField
 *
 * Implementa pequenas validações de campos.
 * Pode ser usado juntamente com a business.
 *
 * @category traits
 */
trait TvalidField
{

    private $pathLoader = null;

    /**
     * @return args
     * @return string String formatada com os argumentos
     */
    public function format() {
        $args = func_get_args();
        if (\count($args) == 0) { return; }
        if (\count($args) == 1) { return $args[0]; }
        $strArgs = array_shift($args);
        $str = preg_replace_callback('/\\{(0|[1-9]\\d*)\\}/', create_function('$match', '$args = '.var_export($args, true).'; return isset($args[$match[1]]) ? $args[$match[1]] : $match[0];'), $strArgs);
        return $str;
    }

    /**
     * @param string $param Recebe uma string no formato dd/mm/yyyy e retorna uma data Y-m-d, ou a própria string se não for uma data válida
     *
     * @return string formatada Y-m-d
     */
    public function strToDate($param) {
       return $this->tryDate($param) ? date('Y-m-d', strtotime(str_replace('/', '-', $param))) : $param;
    }

    /**
     * @param string $param
     * @return boolean
     */
    public function tryCPF($param){
        return $param;
    }

    /**
     * @param string $param
     * @return boolean
     */
    public function tryCNPJ($param) {
        return $param;
    }

    /**
     * Valida tipo de dado é array('M','F'), com checagem de tipo = true
     *
     * @param string $param
     * @return boolean
     */
    public function tryGender($param) {
        return array_key_exists($param, array('M','F'));
    }

    public function tryString($param) {
        return is_string($param);
    }

    public function tryNumeric($param) {
        return is_numeric($param);
    }

    public function tryNull($param) {
        return is_null($param);
//        return is_null($param) || strlen($param) === 0;
    }

    public function tryFloat($param) {
        return is_float($param);
    }

    public function tryArray($param) {
        return is_array($param);
    }

    public function tryBoolean($param) {
        return is_bool($param);
    }

    public function tryJson($param) {
        json_decode(str_replace("'", '"', $param));
        return ( json_last_error() === 0 );
    }

    public function tryInteger($param) {
        return is_int($param);
    }


    /**
     * Valida Xmlversion to Json
     * @throws Exception
     */
    public function tryXMLversion($xmlversion) {
        $errorCode = Errors::NOT_A_JSON_VALID;
        if ( !$this->tryJson($xmlversion) ) {
            $msgCode = Errors::getCode($errorCode);
            $msgText = Errors::getText($errorCode);
            throw new \Exception($msgText,$msgCode);
        }
    }

    public function tryEmail($email){
        $er = "/^(([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}){0,1}$/";
        return (preg_match($er, $email));
    }

    /**
     * Valida E-mail
     *
     * @param string $email
     * @return boolean
     */
    public function useNull($param) {
        return strlen($param) !== 0 ? $param : null;
    }

    /**
     * Valida se tipo de dado é uma data válida
     *
     * @param string $date
     * @return boolean
     */
    public function tryDate($date) {
        $char = '';
        if(strlen($date) == 10) {
            $pattern = '/\.|\/|-/i';    // . or / or -
            preg_match($pattern, $date, $char);

            $array = preg_split($pattern, $date, -1, PREG_SPLIT_NO_EMPTY);

            if(strlen($array[2]) == 4) {
                // dd.mm.yyyy || dd-mm-yyyy
                if($char[0] == "."|| $char[0] == "-") {
                    $month = $array[1];
                    $day = $array[0];
                    $year = $array[2];
                }
                // mm/dd/yyyy    # Common U.S. writing
                if($char[0] == "/") {
                    $month = $array[0];
                    $day = $array[1];
                    $year = $array[2];
                }
            }
            // yyyy-mm-dd    # iso 8601
            if(strlen($array[0]) == 4 && $char[0] == "-") {
                $month = $array[1];
                $day = $array[2];
                $year = $array[0];
            }
            if(checkdate($month, $day, $year)) {    //Validate Gregorian date
                return true;
            } else {
                return false;
            }
        }else {
            return false;    // more or less 10 chars
        }
    }

    /**
     * Retorna Um Ano a partir da Data Atual
     * @return \Date now +1 year
     */
    public function getNextYear () {
        $date = strtotime(\date("Y-m-d", strtotime(\date("Y-m-d"))) . "+1 year");
        return \date("Y-m-d",$date);
    }

    public function seemsUTF8($str) {
        $length = strlen($str);
        for ($i=0; $i < $length; $i++) {
            $c = ord($str[$i]);
            if ($c < 0x80) $n = 0; # 0bbbbbbb
            elseif (($c & 0xE0) == 0xC0) $n=1; # 110bbbbb
            elseif (($c & 0xF0) == 0xE0) $n=2; # 1110bbbb
            elseif (($c & 0xF8) == 0xF0) $n=3; # 11110bbb
            elseif (($c & 0xFC) == 0xF8) $n=4; # 111110bb
            elseif (($c & 0xFE) == 0xFC) $n=5; # 1111110b
            else return false; # Does not match any model
            for ($j=0; $j<$n; $j++) { # n bytes matching 10bbbbbb follow ?
                if ((++$i == $length) || ((ord($str[$i]) & 0xC0) != 0x80))
                    return false;
            }
        }
        return true;
    }

    /**
     * Replace accented characters with non accented
     *
     * @param $str
     * @return mixed
     * @link http://myshadowself.com/coding/php-function-to-convert-accented-characters-to-their-non-accented-equivalant/
     */
    public function removeAccents($str) {
      $a = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ', 'ĳ', 'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ', 'œ', 'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ', 'ǽ', 'Ǿ', 'ǿ', 'Ά', 'ά', 'Έ', 'έ', 'Ό', 'ό', 'Ώ', 'ώ', 'Ί', 'ί', 'ϊ', 'ΐ', 'Ύ', 'ύ', 'ϋ', 'ΰ', 'Ή', 'ή');
      $b = array('A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o', 'Α', 'α', 'Ε', 'ε', 'Ο', 'ο', 'Ω', 'ω', 'Ι', 'ι', 'ι', 'ι', 'Υ', 'υ', 'υ', 'υ', 'Η', 'η');
      return str_replace($a, $b, $str);
    }

    /**
     * @param $paramName
     * @return bool
     */
    public function fileExist($paramName) {
        // obtem o diretório root com nome da classe
        $file = $_SERVER["REQUEST_URI"] . $paramName . '.php';

        // verifica se o arquivo existe e se ele não é um diretório
        return (file_exists($file) && !is_dir($file));
    }

    // policy

    /**
     * Valida 'nullable' de um campo
     * @param $policy
     * @param $value
     * @return mixed
     */
    public function nullablePolicy($policy,$value) {
        $message = "Não pode ser nulo ou string vazia!";
        $checked = $policy === false && $this->tryNull($value) ? '{"passed": false, "message":"' ."{$message}". '"}' : '{"passed": true}';
        return json_decode($checked);
    }

    /**
     * Valida 'length' de um campo
     * @param $policy
     * @param $value
     * @return mixed
     */
    public function lengthPolicy($policy,$value) {
        $message = "Não pode ser maior que {$policy} caracteres!";
        $checked =  $policy < strlen($value) ? '{"passed": false, "message":"' ."{$message}". '"}' : '{"passed": true}';
        return json_decode($checked);
    }

}

