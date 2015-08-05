<?php

namespace AppAnest\Setup;

class Start {

    private static $pwd = "";
    private static $usr = "root";
    private static $tmz = "America/Manaus";
    private static $dtb = "mysql:host=localhost;dbname=optimal";

    public static function getPassWord() {
        return self::$pwd;
    }
    public static function getUserName() {
        return self::$usr;
    }
    public static function getTimeZone() {
        return self::$tmz;
    }
    public static function getDataBase() {
        return self::$dtb;
    }
}