<?php
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if(!empty($_POST['path'])){
        $path = test_input($_POST['path']);
        if(!empty($path) && !substr_count( $path,"../")){
            $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/Desktop-Emulator-Private/uploads" . $path;
            if(file_exists($target_dir)){
                $file_arr = explode(".", preg_replace("/\s+/", "", basename($_FILES["uploadedFile"]["name"])));
                $file_name = $file_arr[0];
                $file_type = $file_arr[1];
                $upload_check = true;
            
                if(!file_exists($target_dir)){
                    if(!mkdir($structure, 0, true)){
                        $response["esito"] = "error";
                        $response["message"] = "Errore nella creazione di una cartella nel percorso specificato.";
                        echo json_encode($response);
                        $upload_check = false;
                    }
                }        
                
                $i = 1;    
                if (file_exists($target_dir . $file_name . "." . $file_type)) {
                    while(file_exists($target_dir . $file_name . $i . "." . $file_type)){ $i++;}
                    $file_name .= "($i)";
                }
            
                // // Check file size
                // if ($_FILES["uploadedFile"]["size"] > 500000) {
                //     $response["response"] = "error";
                //     $response["message"] = "File too large, 500000 max";
                //     $uploa_check = false;
                //     echo json_encode($response); 
                // }
            
                // if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                // && $imageFileType != "gif" ) {
                //   echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                //   $uploadOk = 0;
                // }
            
                if ($upload_check) {
                    $response;
                    if (move_uploaded_file($_FILES["uploadedFile"]["tmp_name"], $target_dir . $file_name . "." . $file_type)) {
                        $response["esito"] = "success";
                        $response["message"] = "Il file ". basename( $_FILES["uploadedFile"]["name"]). " è stato caricato con successo.";
                    } else {
                        $response["esito"] = "error";
                        $response["message"] = "Si è verificato un errore nel caricamento del file.";
                    }
                    echo json_encode($response);
                }
                return;
            }
        }
        echo json_encode(["esito" => "error", "message" => "Il seguente percorso non è valido"]); 
    }
    
}
?>