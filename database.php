<?php
require_once('./data/credentials.php');

class DB extends SQLite3 {

    function __construct($url){
        $this->open($url);
    }

    function query_array($sql){
        $ret = $this->query($sql);
        if(!$ret) return NULL;
        else return $ret->fetchArray(SQLITE3_ASSOC);
    }
}

class CredentialDB extends DB{

    function __construct(){
        parent::__construct(Constants::CREDENTIALS_DB_LOCATION);
    }

    function get_user($username){
        return $this->query_array("SELECT * FROM users WHERE username='$username'");
    }

    function verify_user($username, $password){
        $user = $this->get_user($username);
        if(!$user) return FALSE;
        else return password_verify($password, $user['hash']);
    }
}

class CorpusDB extends DB{

    function __construct(){
        parent::__construct(Constants::CORPUS_DB_LOCATION);
    }
}