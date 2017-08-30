<?php
/**
 * Prints the provided line to debug.txt
 */
function trace($line){
	file_put_contents('debug.dat', $line . "\n");
}