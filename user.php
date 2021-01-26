<?php
require_once('./database.php');

session_start();

$json = json_decode(file_get_contents('php://input'), true);
if(!$json || !$json['action']){die();}

$action = $json['action'];

$credentials = new CredentialDB();
if($action == 'login'){
    if(!isset($json['password']) || !isset($json['username'])) die('No password');
    $password = $json['password'];
    $username = $json['username'];
}



if($credentials->verify_user($username, $password)){
    echo "Welcome!";
}else{
    echo "Go away!";
}