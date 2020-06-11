<?php

$files_array = array();
$web_path = "http://" . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] ."/Desktop-Emulator-Private/uploads";

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function formatBytes($size, $precision = 2) {
    $base = log($size, 1024);
    $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');   

    return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
}

function search_file($dir,$file_to_search){   
    $files = scandir($dir);
    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);       
        if(!is_dir($path)) {               
            if(strpos(explode(".", $value)[0], $file_to_search) !== false){
                $file_data["name"] = explode('.', $value)[0];
                $file_data["resource"] = $GLOBALS['web_path'] . str_replace("\\","/",explode("uploads", $path)[1]);
                $file_data["type"] = "File " . explode('.', $value)[1];
                $file_data["ext"] = explode('.', $value)[1];
                $file_data["date"] = date('d/m/Y H:i', fileatime($path));
                $file_data["size"] = formatBytes(filesize($path));
                array_push($GLOBALS['files_array'], $file_data);                    
            }
        } else if($value != "." && $value != "..") {
            search_file($path, $file_to_search);
        }  
    } 
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if(!empty($_GET['path']) && !empty($_GET['fileName'])){
        $path = test_input($_GET['path']);        
        if(!substr_count( $path,"../") && !substr_count( $path,"..")){
            $dir = $_SERVER['DOCUMENT_ROOT'] . "/Desktop-Emulator-Private/uploads" . $path;
            $file_name = test_input($_GET["fileName"]);
           
            $files_array = array();
            search_file($dir, $file_name);
            echo json_encode(["esito" => "success", "data" => $GLOBALS['files_array']]); 
            return;
        }
    } 
    echo json_encode(["esito" => "error", "message" => "Il seguente percorso non è valido"]);      
}

?>