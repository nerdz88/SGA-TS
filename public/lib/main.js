// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-logout").on("click", function () {
        $.ajax({
            type: "GET",
            url: "/api/v1/logout",
            success: function () {
                window.location.href = "/";
            },
            error: function (error) {
                console.log("Logout - KO");
                console.log(error)
                var message = "Impossible de vous déconnecter";
                if (error.error)
                    message += " - " + error.error;
                showErrorToast("Erreur", message);
            }
        });
    });

    $(".btn-retour").on("click", function () {
        window.location = $(this).data("lienRetour");
    });

});

function showSuccessToast(description) {
    showToast("Succès", description, "success");
}
function showErrorToast(description) {
    showToast("Erreur", description, "error");
}

function showToast(titre, description, state) {
    //https://kamranahmed.info/toast?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library
    $.toast({
        text: description,
        heading: titre,
        icon: state,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 5000,
        stack: 5,
        position: 'top-right',
        textAlign: 'left',
        loaderBg: '#9EC600',
    });
}