const page = {};

page.show = function(templateString, vars){
    const content = document.getElementById('content');
    content.innerHTML = vars ? template.replaceVars(templateString, vars) : templateString;
}

page.showHome = function(){
    const vars = {
        usersLink: user.level == 'admin' ? template.usersButton : ''
    };
    page.show(template.replaceVars(template.home, vars));
    page.showTexts();
}

page.showLogin = function(){
    page.show(template.login);
}

page.changeHomepage = function(html){
    document.querySelector('#mainpanel').innerHTML = html;
    document.querySelector('#accountLink').classList.remove('current');
    document.querySelector('#dashboardLink').classList.remove('current');
    document.querySelector('#textsLink').classList.remove('current');
    const usersButton = document.querySelector('#usersLink');
    if(usersButton) usersButton.classList.remove('current');
}

page.showAccount = function(){
    page.changeHomepage(template.replaceVars(template.account, user));
    document.querySelector('#accountLink').classList.add('current');
}

page.showDashboard = function(){
    page.changeHomepage(template.dashboard);
    document.querySelector('#dashboardLink').classList.add('current');
}

page.showTexts = function(){
    page.changeHomepage(template.texts);
    document.querySelector('#textsLink').classList.add('current');

    api.listTexts().then(texts =>{
        if(!texts) return;
        const htmlParts = [];
        for(let text of texts){
            htmlParts.push(template.replaceVars(template.textrow, JSON.parse(text.data)));
        }
        document.getElementById('textsTable').innerHTML = htmlParts.join("");
    });
}

page.showTextEditor = function(text){
    text = JSON.parse(text.data);
    page.changeHomepage(template.texteditor);
}

page.showAnnotationEditor = function(text){
    text = JSON.parse(text.data);
    page.changeHomepage(template.texteditor);
}

page.showUsers = function(){
    if(user.level != 'admin') return page.showDashboard();
    page.changeHomepage(template.users);
    document.querySelector('#usersLink').classList.add('current');

    api.listUsers().then(users =>{
        const htmlParts = [];
        for(let user of users){
            const roles = {
                username: user.username,
                adminselected: user.level == 'admin' ? 'selected' : '',
                teacherselected: user.level == 'teacher' ? 'selected' : '',
                boardselected: user.level == 'board' ? 'selected' : '',
                studentselected: user.level == 'student' ? 'selected' : '',
            }
            const vars = {
                roleselect: template.replaceVars(template.roleSelect, roles),
                username: user.username,
                level: user.level,
                name: user.name,
            }
            htmlParts.push(template.replaceVars(template.userrow, vars));
        }
        document.querySelector('#usersTable').innerHTML = htmlParts.join("");
    });
}