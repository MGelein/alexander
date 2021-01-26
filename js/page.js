const page = {};

page.show = function(templateString, vars){
    const content = document.getElementById('content');
    content.innerHTML = vars ? template.replaceVars(templateString, vars) : templateString;
}

page.showHome = function(){
    const vars = {
        usersLink: user.level == 'admin' ? template.usersButton : ''
    };
    page.show(template.home, vars);
    page.showUsers();
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
    page.changeHomepage(template.account);
    document.querySelector('#accountLink').classList.add('current');
}

page.showDashboard = function(){
    page.changeHomepage(template.dashboard);
    document.querySelector('#dashboardLink').classList.add('current');
}

page.showTexts = function(){
    page.changeHomepage(template.texts);
    document.querySelector('#textsLink').classList.add('current');
}

page.showUsers = function(){
    page.changeHomepage(template.users);
    document.querySelector('#usersLink').classList.add('current');

    const htmlParts = [];
    api.listUsers().then(users =>{
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