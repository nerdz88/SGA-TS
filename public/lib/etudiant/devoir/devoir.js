//Fichier Javascript pour les pages de devoir

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $('.modal').modal();
    $(".form-remettre-devoir").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();

        var form = this;
        var endPoint = "/api/v1/etudiant/devoir/remettre"
        $.ajax({
            type: "POST",
            url: endPoint,
            data: new FormData(form),
            contentType: false,
            processData: false,
            success: function (data) {
                $.alert({
                    title: 'Succès',
                    type: 'green',
                    content: 'Votre devoir a bien été remis',
                    onClose: function() {
                        window.location.reload();
                    }
                });           
            },
            error: function (e) {
                showErrorToast(e.responseJSON.error.message);
            }
        });
    });
    console.log("devoir.js => Page Load");
});


