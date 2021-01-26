<?php
require_once('./database.php');

$db = new DB('./data/test.db');
if(!$db) {
    echo $db->lastErrorMsg();
} else {
    echo "Opened database successfully\n";
}