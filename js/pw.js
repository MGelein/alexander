/**
 * This function generates the "set new password" field only when it is needed. The comparing
 * of the old and new password is handled by the server. We can't trust client-side code.
 */
function changeHTML(){
	//find the password area
	p = $('pass');
	//first empty the found element
	while(p.firstChild){
		p.removeChild(p.firstChild);
	}
	//create a form
	f = ce('form');
	f.setAttribute('class', 'form-horizontal');
	f.setAttribute('action', 'index.php');
	f.setAttribute('method', 'post');
	
	//create a unordered list for all the fields
	ul = ce("ul");
	
	//create the list items
	li1 = ce("li");
	li2 = ce("li");
	li3 = ce("li");
	li4 = ce("li");
	
	//create the items that will fill the previously created list items
	tf1 = ce("input");
	tf2 = ce("input");
	tf3 = ce("input");
	but = ce("input");
	
	//set the button attributs
	but.setAttribute('type', 'submit');
	but.setAttribute('class', 'btn btn-primary')
	but.setAttribute('value', 'Change Password');
	
	//set the first tf attributes
	tf1.setAttribute('type', 'password');
	tf1.setAttribute('name', 'password');
	tf1.setAttribute('placeholder', 'New Password');
	tf1.setAttribute('class', 'form-control');
	tf1.setAttribute('style', 'margin-top: 2px;');
	
	//set the second tf attributes
	tf2.setAttribute('type', 'password');
	tf2.setAttribute('name', 'passwordCheck');
	tf2.setAttribute('class', 'form-control');
	tf2.setAttribute('placeHolder', 'New Password (Repeat)');
	tf2.setAttribute('style', 'margin-top: 2px;');
	
	//set the third tf attributes
	tf3.setAttribute('type', 'password');
	tf3.setAttribute('name', 'passwordOld');
	tf3.setAttribute('placeHolder', 'Old Password');
	tf3.setAttribute('class', 'form-control');
	
	//append all the list items to the list
	ul.appendChild(li4);
	ul.appendChild(li1);
	ul.appendChild(li2);
	ul.appendChild(li3);
	
	//populate the list items
	li4.appendChild(tf3);
	li1.appendChild(tf1);
	li2.appendChild(tf2);
	li3.appendChild(but);
	
	//add the list to the form
	f.appendChild(ul);
	
	//append the form to the previously cleared password area
	p.appendChild(f);
}