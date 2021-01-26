template = {'db': {}};

template.load = async function(){
    template.login = await get('./templates/login.html');
    template.dashboard = await get('./templates/dashboard.html');
}