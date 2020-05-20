<?php
    function formatBytes($size, $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');   
    
        return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
    }

  if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $web_path = "http://localhost/Desktop-App-Emulator/uploads/";
    $dir = "../uploads/";
    $file_list = array();
    $scanned_dir = scandir($dir); //scandir($dir, true); per descending oder, allegare nella chiamata ad un bottone che cambia l'ordine
    foreach ($scanned_dir as $value) {
        if($value != "." && $value != ".."){
            $file_data["name"] = is_file( $dir . $value)? explode('.', $value)[0] : $value;
            $file_data["resource"] = $web_path . $value;
            $file_data["type"] = (filetype($dir . $value) =='dir')? "Cartella" : "File " . explode('.', $value)[1];
            $file_data["ext"] = (filetype($dir . $value) =='dir')? "" : explode('.', $value)[1];
            $file_data["date"] = date('d/m/Y H:i', fileatime($dir . $value));
            $file_data["size"] = formatBytes(filesize($dir . $value));
            array_push( $file_list, $file_data);
        }              
    }
    echo json_encode(["esito" => "success", "data" => $file_list]);
  } else {
      echo json_encode(["esito" => "error", "message" => "Scusa ma qui non rispondo a POST/PUT/PATCH/DELETE, prova da un'altra parte."]);
  }

?>