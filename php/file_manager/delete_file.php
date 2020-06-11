<?php
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

  function delete_files($target) {
    if(is_dir($target)){
        $files = glob( $target . '*', GLOB_MARK ); //GLOB_MARK adds a slash to directories returned

        foreach( $files as $file ){
            delete_files( $file );      
        }

        rmdir( $target );
    } elseif(is_file($target)) {
        unlink( $target );  
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if(!empty($_GET['path'])){
        $path = test_input($_GET['path']);
        $file_name = test_input($_GET["fileName"]);
        if(!empty($file_name) && !empty($path) && !substr_count( $path,"../")){
            $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/Desktop-Emulator-Private/uploads" . $path;
            delete_files($target_dir . $file_name);
            echo json_encode(["esito" => "success"]); 
            return;
        }
    } else 
        echo json_encode(["esito" => "error", "message" => "Il seguente percorso non è valido"]);      
}
?>