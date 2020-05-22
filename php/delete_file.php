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
        $file_name = test_input($_GET["fileName"]);
        if(!empty($file_name) && !empty($path) && !substr_count( $path,"../")){
            $target_dir = "../uploads" . $path;
            if(file_exists($target_dir)){
                if (!unlink("../uploads/".  $target_dir . $file_name)) {  
                    echo json_encode(["esito" => "error"]);
                }  
                else {  
                    echo json_encode(["esito" => "success"]);
                }
                return;  
            }
        }
    } 
    echo json_encode(["esito" => "error", "message" => "Il seguente percorso non è valido"]);      
}
?>