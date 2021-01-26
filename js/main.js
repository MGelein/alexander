let user = {};

window.onload = () => {
    $ = document.querySelector; 
    startup();
}
async function startup(){
    await template.load();
    if(await api.ping()){
        user = await api.whoami();
        page.show(template.dashboard);
    }else{
        page.show(template.login);
    }
}