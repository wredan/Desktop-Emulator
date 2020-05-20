<?php
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = str_replace("/","error",$data);
    return $data;
  }

if ($_SERVER["REQUEST_METHOD"] == "GET") {  
    if (!unlink("../uploads/". test_input($_GET["fileName"]))) {  
        echo json_encode(["esito" => "error"]);
    }  
    else {  
        echo json_encode(["esito" => "success"]);
    }      
}
?>