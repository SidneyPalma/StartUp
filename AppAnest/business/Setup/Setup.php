<?php

namespace AppAnest\Setup;

use AppAnest\Setup\Start;

class Setup extends \Smart\Common\Coach {

    public function __construct() {
        $this->pwd = Start::getPassWord();
        $this->usr = Start::getUserName();
        $this->dtb = Start::getDataBase();
        $this->tmz = Start::getTimeZone();
        parent::__construct();
    }

}