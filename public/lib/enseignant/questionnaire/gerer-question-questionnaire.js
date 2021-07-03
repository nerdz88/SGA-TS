//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

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
