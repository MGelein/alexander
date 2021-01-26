window.onload = () => {
    startup();
}

async function startup(){
    await template.load();
    if(await api.ping()){
        page.show(template.dashboard, {thingy: 'test'});
    }else{
        page.show(template.login);
    }
}