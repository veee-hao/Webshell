<?php

class send 
{
  private $jmap = array(
                        "1"=>"Single machine",
                        "2"=>"QA package",
                        "3"=>"Autotest",
                        "4"=>"Multi machine",
                        "5"=>"Reinstall",
  );
  private $CLI = "/usr/share/hamsta/feed_hamsta.pl";
  
  public function __construct($config)
  {
  }
  public function send_list($type=NULL)
  {
    $params = func_get_args();
    $list = array();
    $cmd = $this->CLI;
    if(file($cmd)) {
      $cmd = $cmd . " " . implode(" ",$params). " 127.0.0.1";
    } else {
      return "CLI script $cmd does not exist!!";
    }
    $ret = `$cmd`;
    $list = explode("\n",$ret);
    array_shift($list);  
    return $list;
  }

  public function send_run()
  {
    require("lib/db.php");
    require("lib/parameters.php");
    require("lib/machine.php");
    $params = func_get_args();
    //print_r($params);
    $cmd = $this->CLI;
    if(file($cmd)) {
      $cmd = $cmd . " " . implode(" ",$params). " 127.0.0.1 >/dev/null";
    } else {
      return "CLI script $cmd does not exist!!";
    }
    $type = "";
    $name = "";
    $host = "";
    //$params = explode(" ", $param);
    for($i=0; $i<count($params)-2; $i+=2) {
      switch ($params[$i]) {
      case "--jobtype":
        $type = $params[$i+1];
        break;
      case "-t":
        $type = $params[$i+1];
        break;
      case "--testname":
        $name = $params[$i+1];
        break;
      case "-n":
        $name = $params[$i+1];
        break;
      case "--host":
        $host = $params[$i+1];
        break;
      case "-h":
        $host = $params[$i+1];
        break;
      default:
        ;
      }
    }
    if( $type == "5" ) $name = "";
    $type = $this->jmap[$type];
    system($cmd,$ret);  
    if($ret == 0)
      return "send $type $name to $host succeed !";
    else
      return "send $type $name to $host failed !";
  }
}


?>

