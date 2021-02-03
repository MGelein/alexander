const ui = {};
ui.noteEditorVars = {};

ui.passwordtype = function(event){
    if(event.key == 'Enter') ui.submitLogin();
}

ui.showCreateNote = function(event, div){
    ui.hideCreateNote();
    setTimeout(() => {
        const sel = window.getSelection();
        if(!sel || sel.rangeCount < 1) return;
        const range = sel.getRangeAt(0);
        const start = range.startOffset < range.endOffset ? range.startOffset : range.endOffset;
        const end = range.startOffset < range.endOffset ? range.endOffset : range.startOffset;
        if(end - start < 1) return;
        
        const button = document.getElementById('createNoteButton');
        button.style.left = event.clientX + 10 + 'px';
        button.style.top = event.clientY + 10 + 'px';
        button.style.display = 'block';
    }, 200);
}

ui.hideCreateNote = function(){
    const button = document.getElementById('createNoteButton');
    button.style.display = 'none';
}

ui.submitLogin = function(){
    const password = document.querySelector('#passwordField').value;
    const username = document.querySelector('#usernameField').value;
    api.loginUser(username, password).then(response =>{
        if(response == 'OK') {
            page.showHome();
            location.reload();
        }else{
            loginFeedback = document.querySelector('#loginFeedback');
            loginFeedback.innerHTML = 'Username or password incorrect!';
            document.querySelector('#passwordField').value = '';
            document.querySelector('#usernameField').value = '';
            document.querySelector('#usernameField').focus();
        }
    });
}

ui.openNewNote = async function(scoped){
    let note = {
        data: {content: '', scope: 'unscoped'},
        urn: await api.requestNoteURN(),
        type: '',
        parent: document.getElementById('parentURN').value,
    }
    await api.addNote(note.urn, note.parent, note.data, note.type);
    if(scoped){
        const sel = window.getSelection();
        if(!sel || sel.rangeCount < 1) return;
        const range = sel.getRangeAt(0);
        const start = range.startOffset < range.endOffset ? range.startOffset : range.endOffset;
        const end = range.startOffset < range.endOffset ? range.endOffset : range.startOffset;
        if(end - start < 1) return;
        const allText = document.getElementById('annotationText').innerText;
        note.data.scope = ui.rangeToScope(allText, start, end);
    }
    ui.openNoteEditor(note);
}

ui.rangeToScope = function(text, start, end){
    const counts = {};
    const parts = [];
    for(let i = 0; i < end; i++){
        const letter = text.substr(i, 1);
        if(counts[letter]) counts[letter] ++;
        else counts[letter] = 1;

        if(i == start) parts.push(`${letter}[${counts[letter]}]`);
        if(i == end - 1) parts.push(`${letter}[${counts[letter]}]`);
    }
    return parts.join("-");
}

ui.scopeToRange = function(text, scope){
    if(!scope || scope == 'unscoped') return [0, text.length];
    const parts = scope.replace(/[\[\]]/g, '').split('-');
    const startLetter = parts[0].charAt(0);
    const endLetter = parts[1].charAt(0);
    let startOcc = parseInt(parts[0].substr(1));
    let endOcc = parseInt(parts[1].substr(1));
    let lastIndex = -1;
    do{
        lastIndex = text.indexOf(startLetter, lastIndex + 1);
        startOcc --;
    }while(startOcc > 0);
    let startIndex = lastIndex;
    lastIndex = -1;
    do{
        lastIndex = text.indexOf(endLetter, lastIndex + 1);
        endOcc --;
    }while(endOcc > 0);
    let endIndex = lastIndex;
    return [startIndex, endIndex];
}

ui.highlightScope = function(scope){
    const annEditor = document.getElementById('annotationText');
    const [start, end] = ui.scopeToRange(annEditor.innerText, scope);
    const selection = document.getSelection();
    if(!selection) return;
    const range = new Range();
    range.setStart(annEditor.firstChild, start);
    range.setEnd(annEditor.firstChild, end);
    selection.removeAllRanges();
    selection.addRange(range);
}

ui.removeHighlight = function(){
    const selection = document.getSelection();
    if(selection) selection.removeAllRanges();
}

ui.openNoteEditor = function(note){
    if(!note.data.scope){
        note.data = JSON.parse(note.data);
    }
    const editorTemplate = template.noteTypeToTemplate(note.type);
    let vars = {
        urn: note.urn,
        parent: note.parent,
        src: note.type == 'urn:seip:edit:src' ? 'selected' : '',
        crit: note.type == 'urn:seip:edit:crit' ? 'selected' : '',
        loc: note.type == 'urn:seip:loc' ? 'selected' : '',
        trans: note.type == 'urn:seip:trans' ? 'selected' : '',
        label: note.type == 'urn:seip:label' ? 'selected' : '',
        comm: note.type == 'urn:seip:comm' ? 'selected' : '',
    }
    const dataFields = Object.keys(note.data);
    for(const dataField of dataFields){
        vars[dataField] = note.data[dataField];
    }
    vars = ui.appendVarsBasedOnType(vars, note);
    vars.editor = template.replaceVars(editorTemplate, vars);
    const html = template.replaceVars(template.noteeditor, vars);
    ui.noteEditorVars = vars;
    ui.hideCreateNote();
    page.showOverlay(html);
}

ui.appendVarsBasedOnType = function(vars, note){
    if(note.type == 'urn:seip:trans'){
        const lang = note.data.language;
        vars.en = lang == 'en' ? 'selected' : '';
        vars.fr = lang == 'fr' ? 'selected' : '';
        vars.de = lang == 'de' ? 'selected' : '';
        vars.nl = lang == 'nl' ? 'selected' : '';
        vars.la = lang == 'la' ? 'selected' : '';
        vars.gr = lang == 'gr' ? 'selected' : '';
    }
    return vars;
}

ui.changeNoteEditorTemplate = function(typeSelect){
    const noteType = typeSelect.value;
    const editorTemplate = template.noteTypeToTemplate(noteType);
    const html = template.replaceVars(editorTemplate, ui.noteEditorVars);
    document.getElementById('editorHolder').innerHTML = html;
}

ui.openNote = async function(urn){
    const note = await api.getNote(urn);
    ui.openNoteEditor(note);
}

ui.removeNote = function(urn){
    if(confirm(`Are you sure you want to remove this note? (${urn})`)){
        api.removeNote(urn).then(()=>{
            page.hideOverlay();
            ui.refreshUnscopedNotesTable();
        });
    }
}

ui.refreshUnscopedNotesTable = function(){
    const parent = document.getElementById('parentURN').value;
    api.getNotesByParent(parent).then(notes =>{
        page.updateUnscopedNotes(notes);
    });}

ui.saveAndExitNote = function(){
    const noteURN = document.getElementById('noteEditorURN').textContent;
    const parent = document.getElementById('noteEditorParent').textContent;
    const scope = document.getElementById('noteEditorScope').textContent;
    const type = document.getElementById('noteEditorType').value;
    const content = document.getElementById('noteEditorContent').innerText;
    let note = {
        'urn': noteURN,
        'parent': parent,
        'type': type,
        'data': {
            'scope': scope,
            'content': content
        }
    }
    note = ui.appendDataBasedOnType(note);
    api.updateNote(note.urn, note.parent, note.data, note.type).then(() =>{
        page.hideOverlay();
        ui.refreshUnscopedNotesTable();
    });
}

ui.appendDataBasedOnType = function(note){
    if(note.type == 'urn:seip:trans'){
        note.data.language = document.getElementById('transLanguage').value;
        note.data.bibliography = document.getElementById('transBib').value;
    }
    return note;
}

ui.openInTextEditor = async function(urn){
    let text = {};
    if(urn) text = await api.getText(urn);
    if(!text.data){
        const newURNInput = document.getElementById('newTextURN');
        if(newURNInput.value.length < 1) {
            ui.blinkError(newURNInput);
            return;
        }
        const newURN = 'urn:seip:texts:' + newURNInput.value;
        if(await api.getText(newURN)){
            ui.blinkError(newURNInput);
            alert("This URN is already taken");
            return;
        }
        text.urn = newURN;
    }
    page.showTextEditor(text);
}

ui.interceptPaste = function(event){
    let pastedText = '';

    if(event.clipboardData && event.clipboardData.getData){
        pastedText = event.clipboardData.getData('text/plain');
    }
    event.stopPropagation();
    event.preventDefault();

    const text = event.target.innerHTML;
    let cursorPos = 0;
    const selection = window.getSelection();
    if(selection){
        const range = selection.getRangeAt(0);
        if(range){
            cursorPos = range.startOffset;
        }
    }
    const newText = text.slice(0, cursorPos) + pastedText + text.slice(cursorPos);
    event.target.innerHTML = newText;
}

ui.openInAnnotationEditor = async function(urn){
    let text = {};
    if(urn) text = await api.getText(urn);
    const notes = await api.getNotesByParent(urn);
    page.showAnnotationEditor(text, notes);
}

ui.submitLogout = function(){
    api.logout().then(() => {
        page.showLogin();
        location.reload();
    });
}

ui.saveTextEditor = function(button){
    ui.showLoading(button);
    const newTitle = document.getElementById('editorTitle');
    const newAuthor = document.getElementById('editorAuthor');
    const newBibliography = document.getElementById('editorBibliography');
    const newLanguage = document.getElementById('editorLanguage');
    const newLevel = document.getElementById('editorLevel');
    const newURN = document.getElementById('editorURN');
    const newContent = document.getElementById('editorContent');
    const newCTSURN = document.getElementById('editorCTSURN');
    const text = {};
    let errorsFound = false;
    if(newTitle.value.length < 2){
        ui.blinkError(newTitle);
        errorsFound = true;
    }
    if(newURN.innerText < 15){
        ui.blinkError(newURN);
        errorsFound = true;
    }
    if(errorsFound) return;
    text.urn = newURN.innerText;
    text.level = newLevel.value;
    text.data = {
        urn: text.urn,
        level: text.level,
        author: newAuthor.value,
        bibliography: newBibliography.value,
        language: newLanguage.value,
        title: newTitle.value,
        content: newContent.innerText,
        ctsurn: newCTSURN.value
    }
    api.updateText(text.urn, text.data, text.level).then(response =>{
        console.log(response);
    });
}

ui.submitRemove = function(urn, button){
    if(confirm(`Are you sure you want to remove this text? (${urn})`)){
        api.removeText(urn).then(() =>{
            page.showTexts();
            ui.showLoading(button);
        });
    }
}

ui.updateUser = function(username, button){
    ui.showLoading(button);
    const newName = document.getElementById(`${username}-name`).value;
    const newLevel = document.getElementById(`${username}-level`).value;
    api.updateUser(username, newName, newLevel);
}

ui.deleteUser = function(username, button){
    if(confirm('Are you sure you want to remove this user?')){
        api.removeUser(username).then(()=>{
            page.showUsers();
        });
    }
}

ui.addUser = function(button){
    ui.showLoading(button);
    const newUsername = document.getElementById('newUsername');
    const newName = document.getElementById('newName');
    const newLevel = document.getElementById('newLevel');
    const newPassword1 = document.getElementById('newPassword1');
    const newPassword2 = document.getElementById('newPassword2');
    let errorFound = false;
    if(newUsername.value.length < 10){
        ui.blinkError(newUsername);
        errorFound = true;
    }
    if(newName.value.length < 5){
        ui.blinkError(newName);
        errorFound = true;
    }
    if(newPassword1.value != newPassword2.value){
        ui.blinkError(newPassword2);
        errorFound = true;
    }else if(newPassword1.value.length < 8){
        ui.blinkError(newPassword2);
        ui.blinkError(newPassword1);
        errorFound = true;
    }
    if(!errorFound){
        api.addUser(newUsername.value, newName.value, newPassword1.value, newLevel.value).then(()=>{
            page.showUsers();
        });
    }
}

ui.changePassword = function(button){
    ui.showLoading(button);
    const newPassword1 = document.getElementById('newPassword1');
    const newPassword2 = document.getElementById('newPassword2');
    let errorFound = false;
    if(newPassword1.value != newPassword2.value){
        ui.blinkError(newPassword2);
        errorFound = true;
    }else if(newPassword1.value.length < 8){
        ui.blinkError(newPassword2);
        ui.blinkError(newPassword1);
        errorFound = true;
    }
    if(!errorFound){
        api.changePassword(newPassword1.value).then(()=>{
            page.showHome();
        });
    }
}

ui.blinkError = function(el){
    el.classList.add('error');
    setTimeout(() => el.classList.remove('error'), 2000);
}

ui.showLoading = function(el){
    if(!el) return;
    const backupInnerHTML = el.innerHTML;
    el.innerHTML = '...';
    el.classList.add('loading');
    setTimeout(() => {
        el.innerHTML = 'Done!';
        el.classList.remove('loading');
        el.classList.add('alt');
        setTimeout(() => {
            el.innerHTML = backupInnerHTML;
            el.classList.remove('alt');
        }, 1000);
    }, 1000);
}