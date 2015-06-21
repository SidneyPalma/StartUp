<?php

namespace Smart\Utils;

/**
 * Session
 * 
 * Realiza todo o controle de autenticação do Usuário no servidor
 * 
 * <code>
 * $session = Session::getInstance();
 * </code>
 */
class Session
{
    public static function have() {
        $usercode = self::read('usercode');
        return ( $usercode !== false );
    }

    public static function read($id) {
        @\session_start();
        return isset($_SESSION[$id]) ? $_SESSION[$id]: false;
    }

    public static function save($id, $data) {
        @\session_start();
        return $_SESSION[$id] = $data;
    }

    public static function kill() {
        @\session_start();
        @\session_unset();
        setcookie("PHPSESSID","",time()-3600,"/");
        return @\session_destroy();
    }

    public static function slay() {
        @\session_start();
        unset($_SESSION['usercode']);
    }

}