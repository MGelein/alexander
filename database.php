<?php
class DB extends SQLite3 {

    function __construct($url){
        $this->open($url);
    }
}