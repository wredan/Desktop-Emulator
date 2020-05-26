<?php

//carico in %
function shapeSpace_system_load($coreCount = 2, $interval = 1) {
	$rs = sys_getloadavg();
	$interval = $interval >= 1 && 3 <= $interval ? $interval : 1;
	$load = $rs[$interval];
	return round(($load * 100) / $coreCount,2);
}

//numero di core
function shapeSpace_system_cores() {
	
    $cmd = "uname";
    $OS = strtolower(trim(shell_exec($cmd)));
 
    switch($OS) {
       case('linux'):
          $cmd = "cat /proc/cpuinfo | grep processor | wc -l";
          break;
       case('freebsd'):
          $cmd = "sysctl -a | grep 'hw.ncpu' | cut -d ':' -f2";
          break;
       default:
          unset($cmd);
    }
 
    if ($cmd != '') {
       $cpuCoreNo = intval(trim(shell_exec($cmd)));
    }
    
    return empty($cpuCoreNo) ? 1 : $cpuCoreNo;
    
}

function shapeSpace_http_connections() {
	if (function_exists('exec')) {	
		$www_total_count = 0;
		@exec ('netstat -an | egrep \':80|:443\' | awk \'{print $5}\' | grep -v \':::\*\' |  grep -v \'0.0.0.0\'', $results);	
		foreach ($results as $result) {
			$array = explode(':', $result);
			$www_total_count ++;
			
			if (preg_match('/^::/', $result)) {
				$ipaddr = $array[3];
			} else {
				$ipaddr = $array[0];
			}
			
			if (!in_array($ipaddr, $unique)) {
				$unique[] = $ipaddr;
				$www_unique_count ++;
			}
		}
		
		unset ($results);
		
		return count($unique);
		
	}
	
}

//uso memoria
function shapeSpace_server_memory_usage() {
	$free = shell_exec('free');
	$free = (string)trim($free);
	$free_arr = explode("\n", $free);
	$mem = explode(" ", $free_arr[1]);
	$mem = array_filter($mem);
	$mem = array_merge($mem);
	$memory_usage = $mem[2] / $mem[1] * 100;
 
	return $memory_usage;
}

//uso disco
function shapeSpace_disk_usage() {
	$disktotal = disk_total_space ('/');
	$diskfree  = disk_free_space  ('/');
	$diskuse   = round (100 - (($diskfree / $disktotal) * 100)) .'%';
	return $diskuse;
}

//server uptime
function shapeSpace_server_uptime() {
	$uptime = floor(preg_replace ('/\.[0-9]+/', '', file_get_contents('/proc/uptime')) / 86400);
	return $uptime;
}

//versione del kernel
function shapeSpace_kernel_version() {
	$kernel = explode(' ', file_get_contents('/proc/version'));
	$kernel = $kernel[2];
	return $kernel;	
}

//numero di processi
function shapeSpace_number_processes() {
	$proc_count = 0;
	$dh = opendir('/proc');
	while ($dir = readdir($dh)) {
		if (is_dir('/proc/' . $dir)) {
			if (preg_match('/^[0-9]+$/', $dir)) {
				$proc_count ++;
			}
		}
	}
	return $proc_count;
}

//memoria usata
function shapeSpace_memory_usage() {	
	$mem = memory_get_usage(true);	
	if ($mem < 1024) {
		$memory = $mem .' B'; 
	} elseif ($mem < 1048576) {
		$memory = round($mem / 1024, 2) .' KB';
	} else {
		$memory = round($mem / 1048576, 2) .' MB';
	}
	return $memory;
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    
    echo json_encode(["esito" => "success", "data" => [
        "caricoSistema" => shapeSpace_system_load(),
        "numeroCore" => shapeSpace_system_cores(),
        "numeroHTTPConnection" => shapeSpace_http_connections(),
        "serverUptime" => shapeSpace_server_uptime(),
        "kernelVersion" => shapeSpace_kernel_version(),
        "processNumber" => shapeSpace_number_processes(),
        "memoryUsage" => shapeSpace_memory_usage(),
    ]]);      
}
?>

