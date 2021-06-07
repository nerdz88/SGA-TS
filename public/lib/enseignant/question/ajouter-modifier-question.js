//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-question").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModifiable = $(form).find('input[name="estModifiable"]').val() == "true";
        var idCoursGroupe = $(form).find('input[name="idCoursGroupe"]').val();
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var endPoint = estModifiable ? "/enseignant/question/modifier/" + idQuestion
            : "/enseignant/question/groupe/" + idCoursGroupe + "/ajouter"

        console.log("Envoyer formulaire - Ajax - Ajouter/Modifier Question");
        envoyerFormulaireAjax(form, estModifiable, idCoursGroupe, endPoint);

    });

    console.log("ajouter-question.js => Page Load");
});

function envoyerFormulaireAjax(form, estModifiable, idCoursGroupe, endPoint) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function () {
            console.log("Ajouter-Modifier Question - OK");
            if (estModifiable) {
                window.location.href = "/enseignant/question/groupe/" + idCoursGroupe;
            }
            else {
                $(form)[0].reset();
                //https://kamranahmed.info/toast?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library
                showSuccessToast("Succès", estModifiable ? "La question a bien été modifier" : "La question a bien été ajouté");
            }
        },
        error: function () {
            console.log("Ajouter Question - KO");
            showErrorToast("Erreur", estModifiable ? "La question n'a pas bien été modifier" : "La question n'a pas été ajouté");
        }
    });
}