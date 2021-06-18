//Fichier Javascript pour les pages de question

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-delete-question").on("click", function () {
        var nomQuestion = $(this).data("nom");
        var idQuestion = $(this).data("idQuestion");
        var idEspaceCours = $(this).data("idEspaceCours");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer cette question: ' + nomQuestion,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "DELETE",
                        url: "/api/v1/enseignant/question/supprimer/" + idEspaceCours  + "/" + idQuestion,
                        success: function () {
                            var endpoint = "/enseignant/question" + (idEspaceCours ? "/" + idEspaceCours : "");
                            window.location.href = endpoint;
                        },
                        error: function () {
                            console.log("Supprimer Question - KO");
                            showErrorToast("Erreur", "La question n'a pas été supprimé");                         
                        }
                    });
                }
            }
        });
    });

    console.log("question.js => Page Load");
});

