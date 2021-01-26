page = {};

page.show = function(templateString){
    const content = document.getElementById('content');
    content.innerHTML = templateString;
}