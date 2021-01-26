const page = {};

page.show = function(templateString, vars){
    const content = document.getElementById('content');
    content.innerHTML = vars ? template.replaceVars(templateString, vars) : templateString;
}

page.showHome = function(){
    const vars = {};
    page.show(template.home, vars);
}

page.showLogin = function(){
    page.show(template.login);
}

page.showAccount = function(){
    
}

page.showDashboard = function(){

}

page.showTexts = function(){

}