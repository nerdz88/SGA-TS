//Fichier Javascript pour la page de liste de cours d'un enseignant

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

    $(".btn-delete-cours").on("click", function () {
        var noGroupe = $(this).data("noGroupe");
        var idGroupe = $(this).data("idGroupe");
        var sigle = $(this).data("sigle");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer ce cours: ' + sigle + " - gr:" + noGroupe,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: 'GET',
                        url: '/api/v1/enseignant/cours/supprimer/' + sigle + "/" + idGroupe,
                        success: function () {
                            window.location.href = "/enseignant/cours";
                        },
                        error: function () {
                            console.log("Supprimer Cours - KO");
                            showErrorToast("Erreur", "Le cours n'a pas été supprimé");
                        }
                    });
                }
            }
        });
    });

    console.log("liste-cours.js => Page Load");
});

