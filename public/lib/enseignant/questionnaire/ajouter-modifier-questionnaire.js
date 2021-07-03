//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-questionnaire").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var isModifierContinuer = $(e.originalEvent.submitter).hasClass("btn-modifier-continuer");
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idQuestionnaire = $(form).find('input[name="idQuestionnaire"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var endPoint = estModification ? `/api/v1/enseignant/questionnaire/modifier/${idEspaceCours}/${idQuestionnaire}`
            : `/api/v1/enseignant/questionnaire/ajouter/${idEspaceCours}`


        envoyerFormulaireAjax(form, endPoint, idEspaceCours, estModification && !isModifierContinuer);
    });
    console.log("ajouter-question.js => Page Load");
});

function envoyerFormulaireAjax(form, endPoint, idEspaceCours, isRetourListeQuestionnaire) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function (data) {
            var urlRedirection = "";
            if (isRetourListeQuestionnaire) {
                urlRedirection = `/enseignant/questionnaire/${idEspaceCours}`;
            }
            else {
                urlRedirection = `/enseignant/questionnaire/question/${idEspaceCours}/${data.idQuestionnaire}`;
            }
            window.location.href = urlRedirection;
        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}