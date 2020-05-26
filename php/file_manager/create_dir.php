<?php
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if(!empty($_GET['path'])){
        $path = test_input($_GET['path']);
        if(!empty($path) && !substr_count( $path,"../") && !substr_count( $path,"..")){
            $name = !empty($_GET['name'])? test_input($_GET['name']) : "Nuova Cartella";
            $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/Desktop-Emulator/uploads" . $path . '/' . $name;
            if(!file_exists($target_dir)){
                if(mkdir($target_dir))
                    echo json_encode(["esito" => "success"]);
                    return;
            }
        }
    } 
    echo json_encode(["esito" => "error", "message" => "Il seguente percorso non è valido"]);      
}
?>