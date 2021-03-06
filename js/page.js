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
    page.showAccount();
}

page.showLogin = function(){
    page.show(template.login);
}

page.changeHomepage = function(html){
    document.querySelector('#mainpanel').innerHTML = html;
    document.querySelector('#accountLink').classList.remove('current');
    document.querySelector('#aboutLink').classList.remove('current');
    document.querySelector('#textsLink').classList.remove('current');
    const usersButton = document.querySelector('#usersLink');
    if(usersButton) usersButton.classList.remove('current');
}

page.showAccount = function(){
    page.changeHomepage(template.replaceVars(template.account, user));
    document.querySelector('#accountLink').classList.add('current');
}

page.showAbout = function(){
    page.changeHomepage(template.about);
    document.querySelector('#aboutLink').classList.add('current');
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
    if(text && text.data) text = JSON.parse(text.data);
    else{
        text = {
            author: '',
            title: '',
            urn: text.urn,
            bibliography: '',
            language: 'gr',
            level: user.level,
            content: '',
            ctsurn: ''
        }
    }
    const languages = {
        greekselected: text.language == 'gr' ? 'selected' : '',
        latinselected: text.language == 'la' ? 'selected' : '',
        englishselected: text.language == 'en' ? 'selected' : '',
    }
    const roles = {
        id: 'editorLevel',
        adminselected: text.level == 'admin' ? 'selected' : '',
        teacherselected: text.level == 'teacher' ? 'selected' : '',
        boardselected: text.level == 'board' ? 'selected' : '',
        studentselected: text.level == 'student' ? 'selected' : '',
    }
    text.langselect = template.replaceVars(template.langselect, languages);
    text.roleselect = template.replaceVars(template.roleselect, roles);
    page.changeHomepage(template.replaceVars(template.texteditor, text));
}

page.showAnnotationEditor = function(text, notes){
    if(text && text.data) text = JSON.parse(text.data);
    page.changeHomepage(template.replaceVars(template.annotationeditor, text));
    page.updateUnscopedNotes(notes);
}

page.updateUnscopedNotes = function(notes){
    const htmlParts = [];
    for(let note of notes){
        if(note.data) note.data = JSON.parse(note.data);
        note.scope = note.data.scope;
        htmlParts.push(template.replaceVars(template.noterow, note));
    }
    document.getElementById('unscopedNotesTable').innerHTML = htmlParts.join("");
}

page.showOverlay = function(html){
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.style.display = 'block';
    if(html) overlay.innerHTML = html;
}

page.hideOverlay = function(){
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.style.display = 'none';
    overlay.innerHTML = '';
}

page.showUsers = function(){
    if(user.level != 'admin') return page.showAbout();
    page.changeHomepage(template.users);
    document.querySelector('#usersLink').classList.add('current');

    api.listUsers().then(users =>{
        const htmlParts = [];
        for(let user of users){
            const roles = {
                id: user.username + '-level',
                adminselected: user.level == 'admin' ? 'selected' : '',
                teacherselected: user.level == 'teacher' ? 'selected' : '',
                boardselected: user.level == 'board' ? 'selected' : '',
                studentselected: user.level == 'student' ? 'selected' : '',
            }
            const vars = {
                roleselect: template.replaceVars(template.roleselect, roles),
                username: user.username,
                level: user.level,
                name: user.name,
            }
            htmlParts.push(template.replaceVars(template.userrow, vars));
        }
        document.querySelector('#usersTable').innerHTML = htmlParts.join("");
    });
}