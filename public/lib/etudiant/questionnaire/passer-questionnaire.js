//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-nav-questionnaire").on("click", function (e) {
        var isNext = $(this).hasClass("btn-next-question");
        var form = $("#form-repondre-question");

        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var idQuestionnaire = $(form).find('input[name="idQuestionnaire"]').val();
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var indexQuestion = $(form).find('input[name="indexQuestion"]').val();
        var nbQuestions = $(form).find('input[name="nbQuestions"]').val();

        var newIndexQuestion = isNext ? (indexQuestion + 1) : (indexQuestion - 1);
        var urlRedirection = `/etudiant/questionnaire/afficher/${idEspaceCours}/${idQuestionnaire}/${newIndexQuestion}`;
        var endPoint = `/api/v1/etudiant/questionnaire/question/save/${idEspaceCours}/${idQuestionnaire}/${idQuestion}`;

        envoyerFormulaireAjax(form, endPoint, urlRedirection);
    });
    console.log("passer-questionnaire.js => Page Load");
});

function envoyerFormulaireAjax(form, endPoint, urlRedirection) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function (data) {          
            window.location.href = urlRedirection;
        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}