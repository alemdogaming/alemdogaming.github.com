var visiblePage = '';

$(document).ready(function () {
    $("#sobre").hide();
    $("#autor").hide();
    $("#followMe").hide();
    $("#gamesList").hide();
    visiblePage = 'home';
    var selectedMode = getParameterByName('mode');
    console.log(selectedMode);
    if (selectedMode != '')
        openRequiredSection(selectedMode);
})

function openRequiredSection(requiredSection) {
    if (requiredSection === visiblePage)
        return;
    
    var visPage = visiblePage;
    $('#a' + capitaliseFirstLetter(visPage)).removeClass('selected-menu-item').change();
    $('#a' + capitaliseFirstLetter(requiredSection)).addClass('selected-menu-item').change();
    visiblePage = requiredSection;

    changeSearchVisibility(function(){$("#" + visPage).slideUp('fast', function(){ $("#" + requiredSection).slideDown('medium');})});
}

function changeSearchVisibility(callback) {
    console.log(visiblePage);
    if (visiblePage === 'home' || visiblePage == 'gamesList')
        $("#txtSearch").show();
    else
        $("#txtSearch").hide();

    callback();
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}