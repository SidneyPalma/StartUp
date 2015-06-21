<?php

namespace Smart\Utils;

/**
 * Version
 * 
 * Classe para controle de Versão
 * 
 */
class Version
{    
    private $major = 0;
    private $minor = 0;
    private $patch = 0;
    private $build = 0;
    private $release = '';
    private $version = '';
    private $archive = '';

    public function __construct($archive,$version) {

        $this->archive = $archive;
        $this->version = $version;

        $this->callStepup();
    }

    public function setMajor () {
        $this->major++;
        $this->setNextVersion();
    }

    public function setMinor () {
        $this->minor++;
        $this->setNextVersion();
    }

    public function setPatch () {
        $this->patch++;
        $this->setNextVersion();
    }

    public function setBuild () {
        $this->build++;
        $this->setNextVersion();
    }
    
    public function getMajor () {
        return $this->major;
    }

    public function getMinor () {
        return $this->minor;
    }

    public function getPatch () {
        return $this->patch;
    }

    public function getBuild () {
        return $this->build;
    }

    public function callStepup () {
        $stepup = @explode('|',$this->version);
        $this->getLastVersion();

        if(is_array($stepup)) {
            foreach ($stepup as $method) {
                if(method_exists($this, 'set'.$method)){
                    call_user_func(array($this, 'set'.$method));
                }
            }
        }

        $this->getLastVersion();
    }

    public function getRelease () {
        return $this->release;
    }
    
    public function getVersion () {
        return $this->version;
    }

    public function getLastVersion () {
        $this->release = json_decode(file_get_contents($this->archive));
        list($this->major, $this->minor, $this->patch, $this->build) = @explode('.', $this->release->modulebuild);
    }

    public function setNextVersion () {
        $modulebuild = "{$this->major}.{$this->minor}.{$this->patch}.{$this->build}";
        $logusername = gethostname();

        $this->release = array(
                'application'=>'appanest',
                'logusername'=>$logusername,
                'modulebuild'=>$modulebuild,
                'lastdateapp'=>date('Y-m-d H:i:s')
        );
        $archive = json_encode($this->release, JSON_PRETTY_PRINT);
        file_put_contents($this->archive, $archive);
    }

}