<?php
require_once('./data/credentials.php');
require_once('./const.php');

class DB extends SQLite3 {

    function __construct($url){
        $this->open($url);
    }

    function query_array($sql){
        $ret = $this->query($sql);
        if(!$ret) return NULL;
        else{
            $rows = array();
            do{
                $row = $ret->fetchArray(SQLITE3_ASSOC);
                if($row) array_push($rows, $row);
            } while($row);
            return $rows;
        }
    }
}

class CredentialDB extends DB{

    function __construct(){
        parent::__construct(Constants::CREDENTIALS_DB_LOCATION);
    }

    function get_user($username){
        return $this->query_array("SELECT * FROM users WHERE username='$username'")[0];
    }

    function add_user($username, $name, $password, $levelString){
        $level = levelstring_to_level($levelString);
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users(username, name, hash, level) VALUES('$username', '$name', '$hash', $level)";
        $this->exec($sql);
    }

    function remove_user($username){
        $username = preg_replace("/[^a-zA-Z0-9@\.]/", "", $username);
        $sql = "DELETE FROM users WHERE username='$username'";
        $this->exec($sql);
    }

    function update_user($username, $new_name, $new_levelString){
        $username = preg_replace("/[^a-zA-Z0-9@\.]/", "", $username);
        $level = levelstring_to_level($new_levelString);
        $sql = "UPDATE users SET name='$new_name', level=$level WHERE username='$username'";
        $this->exec($sql);
    }

    function change_password($new_password){
        $username = preg_replace("/[^a-zA-Z0-9@\.]/", "", $_SESSION['username']);
        $hash = password_hash($new_password, PASSWORD_DEFAULT);
        $sql = "UPDATE users SET hash='$hash' WHERE username='$username'";
        $this->exec($sql);
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

    function add_text($urn, $data, $levelString){
        if($this->get_text($urn)) return FALSE;
        $level = levelstring_to_level($levelString);
        $sql = "INSERT INTO texts(urn, data, level) VALUES('$urn', '$data', $level);";
        $this->exec($sql);
        return TRUE;
    }

    function get_text($urn){
        $sql = "SELECT * FROM texts WHERE urn='$urn'";
        $results = $this->query_array($sql);
        if($results == NULL) return FALSE;
        else return $results[0];
    }
}