page = {};

page.show = function(templateString, vars){
    const content = document.getElementById('content');
    content.innerHTML = vars ? template.replaceVars(templateString, vars) : templateString;
}