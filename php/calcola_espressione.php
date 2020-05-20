<?php

function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }

  if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if((!empty($_GET["number1"]) || $_GET["number1"] == '0') && !empty($_GET["operator"]) && (!empty($_GET["number2"]) || $_GET["number2"] == '0')){
        $number1 = test_input($_GET["number1"]);
        $operator = test_input($_GET["operator"]);
        $number2 = test_input($_GET["number2"]);
        $result = "";
        if(is_numeric($number1) && is_numeric($number2)){

            switch ($operator) {
                case '+': $result = strval($number1 + $number2);
                    break;
                case '-': $result = strval($number1 - $number2);
                    break;
                case '/':   if($number2 != 0) 
                                $result = strval($number1 / $number2);
                            else {
                                $result = "Mmmm... Se parliamo di limite allora";
                                if($number1 < 0)
                                    $result .= " -∞";
                                else if($number1 == 0)
                                    $result .= " forma indeterminata";
                                else if($number1 > 0)
                                    $result .= " ∞";
                                $result .=", ma questa è un'altra storia";
                            }                                
                    break;
                case '*': $result = strval($number1 * $number2);
                    break;                
                default:
                    $result = "Operando non ammesso.";
                    break;
            }
            echo $result;
        } else {
            echo "Inserisci dei numeri validi.";
        }
    } else {
        echo "Inserisci il numero di parametri corretto.";
    }    
  } else {
      echo "Scusa ma qui non rispondo a POST/PUT/PATCH/DELETE, prova da un'altra parte.";
  }

?>