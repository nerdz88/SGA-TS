//Fichier Javascript pour la page d'ajout de cours
// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {


    initEvenementModifierQuestion();

    $(".ckb-tags").on("change", function() {      
        $(".question-item").each(function() {
            var question = $(this);
            $(question).addClass("hide");
            var tags = $(question).data("tags");
            $(tags).each(function(){
                var tag = this;
                var tagValue = $(`.ckb-tags[name='${tag}']`).is(':checked');
                if(tagValue)
                    $(question).removeClass("hide");
            });       
        });       
    });

    $(".question-item").on("click", function() {
        var question = $(this);
        $(question).toggleClass("selected");
    });

    $("#form-sauvegarder-questions").on("submit", function (e) {
        e.preventDefault();
        var idEspaceCours = $(this).find('input[name="idEspaceCours"]').val();
        var idQuestionnaire = $(this).find('input[name="idQuestionnaire"]').val();
        var endPoint = `/api/v1/enseignant/questionnaire/question/${idEspaceCours}/${idQuestionnaire}`;
        var lstIdquestion = [];        
        $(".question-item.selected").each(function() {
                var question = $(this);
                lstIdquestion.push($(question).data("id"));
        });                
        $.ajax({
            type: "POST",
            url: endPoint,
            data: { data: lstIdquestion.join(",") },
            success: function (data) {
                window.location.href = `/enseignant/questionnaire/${idEspaceCours}`;       
            },
            error: function (e) {
                showErrorToast(e.responseJSON.error.message);
            }
        });   
    });

});


function initEvenementModifierQuestion() {
    $(".btn-modifier-question").on("click", function () {
        var idQuestion = $(this).data("idQuestion");
        var idEspaceCours = $(this).data("idEspaceCours");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez vous vraiment continuer? Vos modifications non sauvegardés vont être perdu.',
            buttons: {
                confirm: function () {
                    window.location.href =  `/enseignant/question/modifier/${idEspaceCours}/${idQuestion}`;
                }
            }
        });
    });
}