<?php
/**
 * Main PHP file. Takes care of all the necessary imports. You only need to
 * import this file into a page to import all the other dependencies.
 */
//Import some basic utilities
require_once 'classes/util/util.php';

//Import all data and data manipulation objects
require_once 'classes/data/registry.php';
require_once 'classes/data/sqlconnection.php';
require_once 'classes/data/user.php';
require_once 'classes/data/text.php';
require_once 'classes/data/author.php';
require_once 'classes/data/note.php';
require_once 'classes/data/markup.php';

//Import all templates
require_once 'classes/template/template.php';
require_once 'classes/template/editortemplate.php';
require_once 'classes/template/footertemplate.php';
require_once 'classes/template/headertemplate.php';
require_once 'classes/template/documenttemplate.php';
require_once 'classes/template/navigationtemplate.php';
require_once 'classes/template/adminutiltemplate.php';
require_once 'classes/template/textitemtemplate.php';
require_once 'classes/template/markuptemplate.php';

//Sets the default timezone to Europe/Amsterdam. Used when uploading documents
date_default_timezone_set('Europe/Amsterdam');