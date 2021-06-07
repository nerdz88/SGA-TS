// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function()
{
     

});

function showSuccessToast(titre, description) {
    showToast(titre, description, "success");
}
function showErrorToast(titre, description) {
    showToast(titre, description, "error");
}

function showToast(titre, description, state){
    //https://kamranahmed.info/toast?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library
    $.toast({
        text: description, 
        heading: titre,
        icon: state, 
        showHideTransition: 'fade',
        allowToastClose: true, 
        hideAfter: 2500, 
        stack: 5, 
        position: 'top-right', 
        textAlign: 'left',  
        loaderBg: '#9EC600',  
    });
}