//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

    $('.datepicker').datepicker({
        defaultDate: new Date(),
        format: "dd-mm-yyyy"
    });
    $('.timepicker').timepicker({
        twelveHour: false
    });

    $("#form-ajouter-devoir").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idDevoir = $(form).find('input[name="idDevoir"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var endPoint = estModification ? "/api/v1/enseignant/devoir/modifier/" + idEspaceCours + "/" + idDevoir
            : "/api/v1/enseignant/devoir/ajouter/" + idEspaceCours 

        console.log("Envoyer formulaire - Ajax - Ajouter/Modifier Question");
        envoyerFormulaireAjax(form, estModification, idEspaceCours, endPoint);
    });
    console.log("modifier-ajouter-devoir.js => Page Load");
});

function envoyerFormulaireAjax(form, estModification, idEspaceCours, endPoint) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function () {
            console.log("Ajouter-Modifier devoir - OK");
            if (estModification) {
                window.location.href = "/enseignant/devoir/" + idEspaceCours;
            }
            else {
                $(form)[0].reset();
                showSuccessToast("Succès", estModification ? "La devoir a bien été modifier" : "La devoir a bien été ajouté");
            }
        },
        error: function () {
            console.log("Ajouter devoir - KO");
            showErrorToast("Erreur", estModification ? "La devoir n'a pas bien été modifier" : "La devoir n'a pas été ajouté");
        }
    });
}