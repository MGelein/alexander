const template = {'db': {}};

template.load = async function(){
    template.login = await get('./templates/login.html');
    template.home = await get('./templates/home.html');
    template.account = await get('./templates/account.html');
    template.texts = await get('./templates/texts.html');
    template.dashboard = await get('./templates/dashboard.html');
    template.users = await get('./templates/users.html');
    template.userrow = await get('./templates/userrow.html');
    template.texteditor = await get('./templates/texteditor.html');
    template.annotationeditor = await get('./templates/annotationeditor.html');
    template.textrow = await get('./templates/textrow.html');
    template.noteeditor = await get('./templates/noteeditor.html');

    template.usersButton = "<li><a id='usersLink' onclick='page.showUsers()'>Users</a></li>";
    template.roleselect = `<select name='roleselect' id='{{id}}'><option value='admin' {{adminselected}}>admin</option>
    <option value='board' {{boardselected}}>board</option><option value='teacher' {{teacherselected}}>teacher</option>
    <option value='student' {{studentselected}}>student</option></select>`;
    template.langselect = `<select id='editorLanguage' name='textLanguage'>
    <option value='gr' {{greekselected}}>Greek</option><option value='la' {{latinselected}}>Latin</option>
    <option value='en' {{englishselected}}>English</option></select>`;
}

template.replaceVars = function(templateString, vars){
    if(!vars) vars = {};
    const keys = Object.keys(vars);
    let replaced = templateString + "";
    for(const key of keys){
        re = new RegExp(`{{${key}}}`, 'g');
        replaced = replaced.replace(re, vars[key]);
    }
    return replaced;
}