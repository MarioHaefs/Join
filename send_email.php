<?php

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $recipient = $_POST['email'];
        $subject = "Password Reset Request";
        $headers = "From:  noreply@developerakademie.com";

        mail($recipient, $subject, "Please click on tis link sent to you via email to reset your password: https://gruppe-5009.developerakademie.net/send_mail/send_mail.php", $headers);
        header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
