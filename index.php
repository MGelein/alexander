<?php
// necessary imports
require_once 'classes/alexander.php';

// start session
restartSession ();

//establish DB connection
$connection = SQLConnection::getActive();


// declare necessary variables for this page
$email = $password = $loginInfo = $accountInfo = $user = "";

// check if the logout button has been pressed
if (isset ( $_POST ['logout'] )) {
	User::logOut();
}

// check if login values have just been posted, if so, handle this
if (isset ( $_POST ['email'] ) && isset ( $_POST ['password'] )) {
	$e = $_POST['email'];
	$p = $_POST['password'];
	$loginInfo = handleLogin();
}

// check if we are logged in and if we are changing the password
if (isset ( $_SESSION ['user'] ) && isset ( $_POST ['password'] ) && isset ( $_POST ['passwordCheck'] ) && isset ( $_POST ['passwordOld'] )) {
	$accountInfo = changePassword();
}

// rendering the login page content if not logged in
if (! isset ( $_SESSION ['user'] )) {
	showLoginScreen($loginInfo);
	
} else {	
	// we're logged in, load the user data
	$user = new User($_SESSION['user']);
	
	//now show the account screen
	$headerTemplate = new HeaderTemplate('Account');
	$headerTemplate->replaceVars(array('htmlTitle'=> 'Account','css' => '<link rel="stylesheet" href="min.php?css=index.css">'));
	echo $headerTemplate->display();
	
	// show navigation bar with the provided active tab
	$navigationTemplate = new NavigationTemplate('account');
	echo $navigationTemplate->display();
	
	// the account overview screen
	$accountTemplate = new Template ( 'templates/account.html' );
	
	// check if admin account and add a link to ADD USER
	if ($user->getLevel() == 0) {
		$adminUtilTemplate = new AdminUtilTemplate();
		$sqlResult = "NO QUERY";
		if (isset ( $_POST ['sqlField'] )) {
			if($_POST['sqlField'] != ''){
				$sqlResult = "";
				$result = $connection->query ( $_POST ['sqlField'] );
				
				if($result){
					if($result === true){
						$sqlResult .= "QUERY OK";
					}else{
						$row = $result->fetch_row();
						do {
							$sqlResult .= "<tr>";
							$max = count ( $row );
							for($i = 0; $i < $max; $i ++) {
								$sqlResult .= "<td>" . $row [$i] . "</td>";
							}
							$sqlResult .= "</tr>";
							$row = $result->fetch_row();
						}while ( $row );
					}
				}else{
					$sqlResult .= "NOT A VALID QUERY OR NO DB CONNECTION.";
				}
			}
		}
		$adminUtilTemplate->replaceVars(array('sqlField' => $sqlResult));
		$adminUtil = $adminUtilTemplate->display();
	} else {
		$adminUtil = "";
	}
	
	$user = new User($_SESSION['user']);
	
	// render the template based on the replace variables
	$accountTemplate->replaceVars ( array (
			'name' => $user->getName(),
			'user' => $user->getEmail(),
			'accountInfo' => $accountInfo,
			'adminUtil' => $adminUtil,
			'userLevel' => $user->getLevelName() 
	) );
	echo $accountTemplate->display ();
}

//close the connection
$connection->close();

// rendering the footer
$footerTemplate = new FooterTemplate();
$footerTemplate->display();

exit();

/////////////////////////////////////////
// END OF PAGE
/////////////////////////////////////////


/**
 * Immediately shows the login screen. This is just used for organizing purposes in the code.
 * Optionally pass some loginInfo (i.e: the password didn't mathc)
 */
function showLoginScreen($loginInfo){
	// show the login scree	n
	$headerTemplate = new HeaderTemplate('Login', 'index.css');
	echo $headerTemplate->display();
	$loginTemplate = new Template ( 'templates/login.html' );
	$loginTemplate->replaceVars ( array (
			'loginInfo' => $loginInfo
	) );
	echo $loginTemplate->display ();
}

/**
 * Returns the status of the password chaning (succes or failure)
 * @return string
 */
function changePassword(){
	// retrieve post_data
	$password = getPost ( 'password' );
	$passwordCheck = getPost ( 'passwordCheck' );
	$passwordOld = getPost ( 'passwordOld' );
	$email = $_SESSION ['user'];
	$accountInfo = "";
	
	// input checks
	if (strlen ( $password ) < 6) {
		$accountInfo = "<p class='bg-danger'>Password must be at least 6 characters long.</p>";
	} else if ($password != $passwordCheck) {
		$accountInfo = "<p class='bg-danger'>The Password Repeat doesn't match the Password input.</p>";
	} else { // we can change the password
	
		// check if the old password matches
		$user = new User($email);
		
		// check if we have data connection
		if (password_verify($passwordOld, $user->getPassword())) { // old password is indeed correct
			// insert into DB
			if (! $user->changePassword($password)){
				die ( $db_result_error );
			}else{
				$accountInfo = "<p class='bg-succes'>Password changed.</p>";
			}
		} else {
			$accountInfo = "<p class='bg-danger'>Incorrect Old Password.</span>";
		}
	}
	return $accountInfo;
}

/**
 * Tries to login and returns the loginInfo text
 */
function handleLogin(){
	// retrieve email and pass from post data
	$loginInfo = '';
	$email = getPost ( 'email' );
	$user = new User($email);
	$password = getPost('password');
	if(password_verify($password, $user->getPassword())){
		//Check if we need to rehash
		if(password_needs_rehash($user->getPassword(), PASSWORD_DEFAULT, $options = ['cost' => 12])){
			$user->changePassword($password);
		}
		//Set the user email in the session, indicating we're logged in
		$_SESSION ['user'] = $email;
	}else{
		$loginInfo = "&#x2716 Incorrect email/password combination";
	}
	return $loginInfo;
}