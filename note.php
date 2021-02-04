<?php
require_once('./const.php');
require_once('./database.php');
session_start_if_valid();
if(!is_logged_in()) exit();
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
if(!$json || !isset($json['action'])) exit();

$action = strtolower($json['action']);
$corpus = new CorpusDB();

if($action == 'add' || $action == 'update'){
    if(!isset($json['urn']) || !isset($json['parent']) || !isset($json['type']) || !isset($json['data'])) exit('missing');
    $urn = $json['urn'];
    $data = json_encode($json['data']);
    $type = $json['type'];
    $parent = $json['parent'];
    $corpus->update_note($urn, $parent, $data, $type);
    exit("OK");
}else if ($action == 'list'){
    if(!isset($json['filter'])) exit();
    $filter = $json['filter'];
    $sql = '';
    if($filter == 'parent'){
        if(!isset($json['parent'])) exit();
        $parent = $json['parent'];
        $sql = "SELECT * FROM notes WHERE parent='$parent'";
    }else if($filter == 'type'){
        if(!isset($json['type'])) exit();
        $type = $json['type'];
        $sql = "SELECT * FROM notes WHERE type='$type'";
    }else{
        exit();
    }
    $result = $corpus->query_array($sql);
    exit(json_encode($result));
}else if($action == 'get'){
    if(!isset($json['urn'])) exit();
    $note = $corpus->get_note($json['urn']);
    if(!$note) exit();
    else exit(json_encode($note));
}else if($action == 'remove'){
    if(!isset($json['urn'])) exit();
    $urn = $json['urn'];
    $corpus->remove_note($urn);
    exit("OK");
}else if($action == 'request_urn'){
    exit($corpus->get_next_note_urn());
}