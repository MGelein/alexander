//Assign document listeners
$(document).ready(function(){
	alexander.event.registerDocumentListeners();

	//If there is an init function, run it
	if(typeof(init) === 'function' ) init();
});

/**
 * String prototype overwrites.
 * @param suffix
 * @returns {Boolean}
 */
String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};