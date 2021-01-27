<?php
require_once('./const.php');
require_once('./database.php');
session_start();
if(!is_logged_in()) exit();
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
if(!$json || !isset($json['action'])) exit();

$action = strtolower($json['action']);
$corpus = new CorpusDB();
if($action == 'add'){
    $urn = $json['urn'];
    $data = json_encode($json['data']);
    $level = $json['level'];
    $corpus->add_text($urn, $data, $level);
    exit("OK");
}