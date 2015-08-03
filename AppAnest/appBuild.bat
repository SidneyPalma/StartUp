cls

::Preparando build version
    set curPath="%cd%"
    php -f %curPath%/business/Build.php

::Gerando build
    sencha app build

::Iniciando versão build
    start http://localhost:8080/appanest