<?php
    require "globals.php";
    require "lib/User.php";
    $config = ConfigFactory::build ();
    $res = Authenticator::password ("administrator", "password", $config);
    //require "globals.php";
    require_once "include/jsonRPCServer.php";
    require_once "include/rpc_pdo.php";
    require "include/rpc_send.php";
    $m = new send($config);
    //$a=$m->send_list();
    //$a=$m->job_get('27');
    //$a=$m->machine_get("linux-64r5");
    //$a=$m->machine_search('zbhan');
    //echo json_encode($a);
    //print_r($m->send_list("-t","1","-l"));
//    echo $m->send_run("-t", "1", "-n", "test","-h", "apac2-ph021");
    jsonRPCServer::handle($m) or print 'no request';
?>



