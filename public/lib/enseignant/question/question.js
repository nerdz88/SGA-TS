//Fichier Javascript pour les pages de question

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-delete-question").on("click", function () {
        var nomQuestion = $(this).data("nom");
        var idQuestion = $(this).data("idQuestion");
        var idCoursGroupe = $(this).data("idCoursgroupe");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer cette question: ' + nomQuestion,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: 'GET',
                        url: '/enseignant/question/supprimer/' + idQuestion,
                        success: function () {
                            var endpoint = "/enseignant/question" + (idCoursGroupe ? "/groupe/" + idCoursGroupe : "");
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

