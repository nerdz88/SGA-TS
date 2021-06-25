//Fichier Javascript pour la page de liste de cours d'un enseignant

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

    $(".btn-delete-cours").on("click", function () {
        var titreEspace = $(this).data("titreEspaceCours");
        var idEspaceCours = $(this).data("idEspaceCours");

        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer ce cours: ' + titreEspace,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: 'DELETE',
                        url: '/api/v1/enseignant/cours/supprimer/' + idEspaceCours,
                        success: function () {
                            window.location.href = "/enseignant/cours";
                        },
                        error: function (e) {
                            showErrorToast(e.responseJSON.error.message);
                        }
                    });
                }
            }
        });
    });

    console.log("liste-cours.js => Page Load");
});

