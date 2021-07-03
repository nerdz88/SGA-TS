//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-questionnaire").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idQuestionnaire = $(form).find('input[name="idQuestionnaire"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var endPoint = estModification ? "/api/v1/enseignant/questionnaire/modifier/" + idEspaceCours + "/" + idQuestionnaire
            : "/api/v1/enseignant/questionnaire/ajouter/" + idEspaceCours

        console.log("Envoyer formulaire - Ajax - Ajouter/Modifier Question");
        envoyerFormulaireAjax(form, estModification, idEspaceCours, endPoint);
    });
    console.log("ajouter-question.js => Page Load");
});

function envoyerFormulaireAjax(form, estModification, idEspaceCours, endPoint) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function (data) {
            console.log("Ajouter-Modifier Questionnaire - OK");
            console.log(data);
            if (estModification) {
                window.location.href = "/enseignant/questionnaire/" + idEspaceCours;
            }
            else {
                window.location.href = "/enseignant/questionnaire/ajouterQuestion/" +idEspaceCours + "/" + data.idQuestionnaire;
            }
        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}