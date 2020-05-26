<?php
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

  if ($_SERVER["REQUEST_METHOD"] == "GET") {
      if(!empty($_GET['resource'])){
        $path = test_input($_GET['resource']);
        if(!empty($path) && !substr_count( $path,"../")){
            $web_path = "http://" . $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] ."/Desktop-Emulator/uploads" . $path;
            $file_list = array();
            $dir = $_SERVER['DOCUMENT_ROOT'] . "/Desktop-Emulator/uploads" . $path;
            if(file_exists($dir)){
                $scanned_dir = scandir($dir); //scandir($dir, true); per descending oder, allegare nella chiamata ad un bottone che cambia l'ordine
                foreach ($scanned_dir as $value) {
                    if($value != "." && $value != ".."){
                        $file_data["name"] = is_file( $dir . $value)? explode('.', $value)[0] : $value;
                        $file_data["resource"] =(filetype($dir . $value) =='dir')? $path . $value . '/' : $web_path . $value; 
                        $file_data["type"] = (filetype($dir . $value) =='dir')? "Cartella" : "File " . explode('.', $value)[1];
                        $file_data["ext"] = (filetype($dir . $value) =='dir')? "" : explode('.', $value)[1];
                        $file_data["date"] = date('d/m/Y H:i', fileatime($dir . $value));
                        $file_data["size"] = formatBytes(filesize($dir . $value));
                        array_push( $file_list, $file_data);
                    }              
                }
                echo json_encode(["esito" => "success", "data" => $file_list]);
                return;
            }                       
        }   
        echo json_encode(["esito" => "error", "message" => "Il seguente percorso non è valido"]);     
      }    
  } else {
      echo json_encode(["esito" => "error", "message" => "Scusa ma qui non rispondo a POST/PUT/PATCH/DELETE, prova da un'altra parte."]);
  }

?>