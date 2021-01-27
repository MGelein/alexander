<?php
require_once('./const.php');
require_once('./database.php');
session_start();
header('Content-Type: application/json');

$json = json_decode(file_get_contents('php://input'), true);
if(!$json || !isset($json['action'])) exit();

$action = strtolower($json['action']);

