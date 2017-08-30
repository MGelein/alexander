<?php
require_once 'classes/alexander.php';

// restart the session
restartSession ();

// page variables
$adminUser = false; // default is assume user has not enough privileges
$addUserInfo = $email = $password = "";

// check if a user is logged in
if (isset ( $_SESSION['user'] )) {
	$user = new User($_SESSION['user']);
	// check if the username matches anyone
	if ($user->getID() == -1) { // if it doesn't match anything somethings wrong >> LOG OFF
		User::logOut();
	} else if ($user->getLevel() == 0) { // Only users with level==0 are allowed to add new users
		$adminUser = true;
	} else { // user with insufficient privileges.
		forward ('index.php');
	}
	
	// check if all fields have been filled
	if (isset ( $_POST ['email'] ) && isset ( $_POST ['password'] ) && isset ( $_POST ['passwordCheck'] ) && isset ( $_POST ['level'] )
			&& isset( $_POST ['fullName'] )&& $adminUser) {
		
		// retrieve the post variables
		$email = getPost ( 'email' );
		$password = getPost ( 'password' );
		$passwordCheck = getPost ( 'passwordCheck' );
		$level = getPost ( 'level' );
		$fullName = getPost('fullName');
		
		// check if the passwordCheck matches.
		if (strlen ( $email ) < 5) {
			$addUserInfo = "Invalid Email Address";
		} else if (! is_numeric ( $level )) {
			$addUserInfo = "Invalid Access Level";
		} else if ($password != $passwordCheck) {
			$addUserInfo = "The passwords don't match!";
		} else {
			// check if this email address is already being used
			if (User::exists($email)) {
				$addUserInfo = "That user already exists.";
			}else{
				// hash the password
				$password = hash ( 'md5', User::$salt . $password . User::$salt );
			
				// everything checks out, let's add a new user.
				User::registerNew($email, $password, $level, $fullName);
			}
			}
	}
} else {
	forward('index.php');
	exit ();
}
$connection = SQLConnection::getActive();
$connection->close();

// rendering the header
$headerTemplate = new HeaderTemplate('Add User');
echo $headerTemplate->display ();

// render the navBar
$navigationTemplate = new NavigationTemplate('account');
echo $navigationTemplate->display ();

// render the content based on user privileges
if ($adminUser) {
	$addUserTemplate = new Template ( 'templates/adduser.html' );
	$addUserTemplate->replaceVars ( array (
			'addUserInfo' => $addUserInfo 
	) );
	echo $addUserTemplate->display ();
} else {
	forward('index.php');
	exit();
}

// rendering the footer
$footerTemplate = new FooterTemplate();
echo $footerTemplate->display ();
?>