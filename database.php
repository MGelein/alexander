<?php
require_once('./data/credentials.php');

class DB extends SQLite3 {

    function __construct($url){
        $this->open($url);
    }
}

class CredentialDB extends DB{

    function __construct(){
        parent::__construct('./data/credentials.db');
    }
}

class CorpusDB extends DB{

    function __construct(){
        parent::__construct('./data/corpus.db');
    }
}