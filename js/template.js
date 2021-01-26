const template = {'db': {}};

template.load = async function(){
    template.login = await get('./templates/login.html');
    template.home = await get('./templates/home.html');
}

template.replaceVars = function(templateString, vars){
    const keys = Object.keys(vars);
    let replaced = templateString + "";
    for(const key of keys){
        re = new RegExp(`{{${key}}}`, 'g');
        replaced = replaced.replace(re, vars[key]);
    }
    return replaced;
}