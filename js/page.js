const page = {};

page.show = function(templateString, vars){
    const content = document.getElementById('content');
    content.innerHTML = vars ? template.replaceVars(templateString, vars) : templateString;
}

page.showHome = function(){
    const vars = {};
    page.show(template.home, vars);
    page.showDashboard();
}

page.showLogin = function(){
    page.show(template.login);
}

page.changeHomepage = function(html){
    document.querySelector('#mainpanel').innerHTML = html;
    document.querySelector('#accountLink').classList.remove('current');
    document.querySelector('#dashboardLink').classList.remove('current');
    document.querySelector('#textsLink').classList.remove('current');
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