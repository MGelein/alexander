<?php
abstract class Level{
    const Admin = 0;
    const Board = 10;
    const Teacher = 20;
    const Student = 30;
}

function is_logged_in(){
    return isset($_SESSION['username']) && isset($_SESSION['userlevel']);
}

function session_start_if_valid(){
    session_start();
    $now = time();
    if (isset($_SESSION['discard_after']) && $now > $_SESSION['discard_after']) {
        session_unset();
        session_destroy();
        session_start();
    }
}

function levelstring_to_level($str){
    $str = strtolower($str);
    if($str == 'admin') return Level::Admin;
    else if($str == 'board') return Level::Board;
    else if($str == 'teacher') return Level::Teacher;
    else return Level::Student;
}

function level_to_levelstring($level){
    if($level == Level::Admin) return 'admin';
    else if($level == Level::Board) return 'board';
    else if($level == Level::Teacher) return 'teacher';
    else return 'student';
}