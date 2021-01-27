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
    if($corpus->add_text($urn, $data, $level)) exit("OK");
    else exit();
}else if ($action == 'list'){
    $level = $_SESSION['userlevel'];
    $sql = "SELECT * FROM texts WHERE level>=$level";
    $result = $corpus->query_array($sql);
    exit(json_encode($result));
}else if($action == 'get'){
    if(!isset($json['urn'])) exit();
    $text = $corpus->get_text($json['urn']);
    if(!$text) exit();
    else if($text['level'] > $_SESSION['userlevel']) exit();
    else exit(json_encode($text));
}