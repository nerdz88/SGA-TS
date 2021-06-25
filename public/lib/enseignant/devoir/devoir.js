//Fichier Javascript pour les pages de devoir

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-delete-devoir").on("click", function () {
        var nomDevoir = $(this).data("nom");
        var idDevoir = $(this).data("idDevoir");
        var idEspaceCours = $(this).data("idEspaceCours");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer ce devoir: ' + nomDevoir,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "DELETE",
                        url: "/api/v1/enseignant/devoir/supprimer/" + idEspaceCours + "/" + idDevoir,
                        success: function () {
                            var endpoint = "/enseignant/devoir" + (idEspaceCours ? "/" + idEspaceCours : "");
                            window.location.href = endpoint;
                        },
                        error: function (e) {
                            showErrorToast(e.responseJSON.error.message);
                        }
                    });
                }
            }
        });
    });

    console.log("devoir.js => Page Load");
});

