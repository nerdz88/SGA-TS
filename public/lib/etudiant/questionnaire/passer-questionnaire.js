//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $(".btn-nav-questionnaire").on("click", function (e) {
        var isNext = $(this).hasClass("btn-next-question");
        var isTerminerTentative = $(this).hasClass("btn-terminer-tentative");
        var isRelecture = $(this).hasClass("isRelecture");

        var form = $("#form-repondre-question");
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var idQuestionnaire = $(form).find('input[name="idQuestionnaire"]').val();
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var indexQuestion = $(form).find('input[name="indexQuestion"]').val();
        var newIndexQuestion = isNext ? (indexQuestion + 1) : (indexQuestion - 1);

        if (!isRelecture) {        
           
            var urlRedirection = `/etudiant/questionnaire/afficher/${idEspaceCours}/${idQuestionnaire}/${newIndexQuestion}`;
            var endPoint = `/api/v1/etudiant/questionnaire/question/save/${idEspaceCours}/${idQuestionnaire}/${idQuestion}`;


            var urlTerminerTentative;
            if (isTerminerTentative) {
                urlTerminerTentative = `/api/v1/etudiant/questionnaire/terminer/${idEspaceCours}/${idQuestionnaire}`;
                urlRedirection = `/etudiant/questionnaire/afficher/${idEspaceCours}/${idQuestionnaire}/`;
            }

            envoyerFormulaireAjax(form, endPoint, urlRedirection, urlTerminerTentative);
        } else {        
            var url = isTerminerTentative ? `/etudiant/questionnaire/${idEspaceCours}` :
                `/etudiant/questionnaire/afficher/${idEspaceCours}/${idQuestionnaire}/${newIndexQuestion}`;

            window.location.href = url;
        }

    });

    console.log("passer-questionnaire.js => Page Load");
});


function envoyerFormulaireAjax(form, endPoint, urlRedirection, urlTerminerTentative) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function (data) {
            if (urlTerminerTentative) {
                terminerTentativeAjax(urlTerminerTentative, urlRedirection);
            } else {
                window.location.href = urlRedirection;
            }
        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}

function terminerTentativeAjax(endPoint, urlRedirection) {
    $.ajax({
        type: "GET",
        url: endPoint,
        success: function (data) {
            $.alert({
                title: 'Succès',
                type: 'green',
                content: 'Votre tentative a bien été sauvegardé',
                onClose: function () {
                    window.location.href = urlRedirection;
                }
            });

        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}