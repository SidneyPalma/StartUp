<?php

namespace AppAnest\Event;

use Smart\Mail\PasswordComeIn;

class users extends \Smart\Data\Event {

    /**
     * @param \AppAnest\Model\users $model
     */
    public function preInsert( \AppAnest\Model\users &$model ) {
        $pwd = $model->getFullname();
        $hsh = self::getHash($pwd);
        $password = substr($hsh,8,6);

        $model->setPassword($password);
        $model->getSubmit()->setRowValue('password',$password);

        $data = $model->getRecord();

        $body = file_get_contents("../../smart/framework/Mail/tpl/PasswordComeIn.html");

        try {
            $mail = new PasswordComeIn();
            $mail->configEmail($data, $body);
            $sent = $mail->Send();
        } catch (\PDOException $e) {
        }

//        if(intval($sent) !== 0) {
//            throw new \PDOException($mail->ErrorInfo);
//        }

    }

    /**
     * @param \AppAnest\Model\users $model
     */
    public function posInsert( \AppAnest\Model\users &$model ) {

    }

    /**
     * @param \AppAnest\Model\users $model
     */
    public function preUpdate( \AppAnest\Model\Users &$model ) {

    }

    /**
     * @param \AppAnest\Model\users $model
     */
    public function posUpdate( \AppAnest\Model\users &$model ) {

    }

    /**
     * @param \AppAnest\Model\users $model
     */
    public function preDelete( \AppAnest\Model\users &$model ) {

    }

    /**
     * @param \AppAnest\Model\users $model
     */
    public function posDelete( \AppAnest\Model\users &$model ) {

    }

}