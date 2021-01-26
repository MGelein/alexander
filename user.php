<?php
require_once('./const.php');
require_once('./database.php');
session_start();
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
if(!$json || !isset($json['action'])) exit();

$action = strtolower($json['action']);

if($action == 'ping'){
    if(is_logged_in()) echo 'true';
    else echo 'false';
}else if($action == 'login'){
    if(!isset($json['password']) || !isset($json['username'])) exit();
    $password = $json['password'];
    $username = $json['username'];
    
    $credentials = new CredentialDB();
    $verified = $credentials->verify_user($username, $password);
    if(!$verified) exit();
    $user = $credentials->get_user($username);
    $_SESSION['username'] = $username;
    $_SESSION['userlevel'] = $user['level'];
    exit('OK');
}else if($action == 'logout'){
    session_unset();
    exit('OK');
}
//If we make it this far we are not logging in, and thus we should be logged in at this point
if(!is_logged_in()) exit();

$credentials = new CredentialDB();
if($action == 'create' || $action == 'add'){
    if(!isset($json['password']) || !isset($json['username']) || !isset($json['level']) || !isset($json['name'])) exit();
    else if($_SESSION['userlevel'] != Level::Admin) exit();
    $levelString = $json['level'];
    $username = $json['username'];
    $password = $json['password'];
    $name = $json['name'];
    $credentials->add_user($username, $name, $password, $levelString);

    exit('OK');
}else if($action == 'remove' || $action == 'delete'){
    if(!isset($json['username']) || $_SESSION['userlevel'] != Level::Admin) exit();
    $username = $json['username'];
    if($_SESSION['username'] == $username) exit();
    $credentials->remove_user($username);

    exit('OK');
}else if($action == 'list'){
    if($_SESSION['userlevel'] != Level::Admin) exit();
    $sql = 'SELECT * FROM users';
    $result = $credentials->query_array($sql);

    exit(json_encode($result));
}else if($action == 'update'){
    if($_SESSION['userlevel'] != Level::Admin) exit();
    if(!isset($json['username']) || !isset($json['level']) || !isset($json['name'])) exit();
    $username = $json['username'];
    $name = $json['name'];
    $levelString = $json['level'];    
    $credentials->update_user($username, $name, $levelString);

    exit('OK');
}else if($action == 'change_password'){
    if(!isset($json['password'])) exit();
    $new_pass = $json['password'];
    $credentials->change_password($new_pass);

    exit('OK');
}