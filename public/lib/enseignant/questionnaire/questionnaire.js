//Fichier Javascript pour les pages de question

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-delete-questionnaire").on("click", function () {
        var nom = $(this).data("nom");
        var idQuestionnaire = $(this).data("idQuestionnaire");
        var idEspaceCours = $(this).data("idEspaceCours");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer ce questionnaire: ' + nom,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "DELETE",
                        url: "/api/v1/enseignant/questionnaire/supprimer/" + idEspaceCours + "/" + idQuestionnaire,
                        success: function () {
                            var endpoint = "/enseignant/questionnaire" + (idEspaceCours ? "/" + idEspaceCours : "");
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

    console.log("questionnaire.js => Page Load");
});