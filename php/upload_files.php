<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $target_dir = "../uploads/";
    $file_arr = explode(".", preg_replace("/\s+/", "", basename($_FILES["uploadedFile"]["name"])));
    $file_name = $file_arr[0];
    $file_type = $file_arr[1];
    $upload_check = true;
    
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
            $response["response"] = "success";
            $response["message"] = "Il file ". basename( $_FILES["uploadedFile"]["name"]). " è stato caricato con successo.";
        } else {
            $response["response"] = "error";
            $response["message"] = "Si è verificato un errore nel caricamento del file.";
        }
        echo json_encode($response);
    }
}
?>