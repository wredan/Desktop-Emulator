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

function formatBytes($size, $precision = 2) {
    $base = log($size, 1024);
    $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');   

    return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    
    // echo json_encode(["esito" => "success", "data" => [
    //     "caricoSistema" => shapeSpace_system_load(),
    //     "numeroCore" => shapeSpace_system_cores(),
    //     "numeroHTTPConnection" => shapeSpace_http_connections(),
    //     "serverUptime" => shapeSpace_server_uptime(),
    //     "kernelVersion" => shapeSpace_kernel_version(),
    //     "processNumber" => shapeSpace_number_processes(),
    //     "memoryUsage" => shapeSpace_memory_usage(),
	// ]]);  
	//cpu stat
	$prevVal = shell_exec("cat /proc/stat");
	$prevArr = explode(' ',trim($prevVal));
	$prevTotal = $prevArr[2] + $prevArr[3] + $prevArr[4] + $prevArr[5];
	$prevIdle = $prevArr[5];
	usleep(0.15 * 1000000);
	$val = shell_exec("cat /proc/stat");
	$arr = explode(' ', trim($val));
	$total = $arr[2] + $arr[3] + $arr[4] + $arr[5];
	$idle = $arr[5];
	$intervalTotal = intval($total - $prevTotal);
	$stat['cpu'] =  intval(100 * (($intervalTotal - ($idle - $prevIdle)) / $intervalTotal));
	$cpu_result = shell_exec("cat /proc/cpuinfo | grep model\ name");
	$stat['cpu_model'] = strstr($cpu_result, "\n", true);
	$stat['cpu_model'] = str_replace("model name    : ", "", $stat['cpu_model']);
	//memory stat
	$stat['mem_percent'] = round(shell_exec("free | grep Mem | awk '{print $3/$2 * 100.0}'"), 2);
	$mem_total = shell_exec("cat /proc/meminfo | grep MemTotal");
	$stat['mem_total'] = formatBytes(floatval($mem_total));
	$mem_free = shell_exec("cat /proc/meminfo | grep MemFree");
	$stat['mem_free'] = formatBytes(floatval($mem_free));
	$stat['mem_used'] = formatBytes(memory_get_usage());
	//hdd stat
	$hdd_free_space = disk_free_space("/");
	$hdd_total_space = disk_total_space("/");
	$hdd_used_space = $hdd_total_space - $hdd_free_space;
	$stat['hdd_free'] = formatBytes($hdd_free_space);
	$stat['hdd_total'] = formatBytes($hdd_total_space);
	$stat['hdd_used'] = formatBytes($hdd_used_space);
	$stat['hdd_percent'] = round(sprintf('%.2f',($hdd_used_space / $hdd_total_space) * 100), 2) . "%"; 
	//network stat
	$stat['network_rx'] = round(trim(file_get_contents("/sys/class/net/eth0/statistics/rx_bytes")) / 1024/ 1024/ 1024, 2);
	$stat['network_tx'] = round(trim(file_get_contents("/sys/class/net/eth0/statistics/tx_bytes")) / 1024/ 1024/ 1024, 2);
	$carico = sys_getloadavg();
	$stat["media_carico_richieste"] = [
		"1 minuto fa" => $carico[0] * 100 . "%",
		"5 minuti fa" => $carico[1] * 100 . "%",
		"10 minuti fa" => $carico[2] * 100 . "%",
	];
	//output headers
	echo json_encode($stat);
}
?>

