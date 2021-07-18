//Fichier Javascript pour la page d'ajout de cours

$(document).on("click",".ajouterCourteQuestion", function(e){
    if(this.innerHTML=="add"){
        let value= "<div class='col s12'>  <a href='#!' class='waves-effect waves-circle waves-light btn-floating secondary-content'><i class='material-icons ajouterCourteQuestion'>add</i></a>"
        $("#form-ajouter-question-vf").append("<div class='row'><div class='input-field col s12'><input type='text' class='validate'><label for='text'>Entrer votre courte question !</label><div class='input-field col s12'><input type='text' class='validate'><label for='text'>Entrer votre réponse !</label></div></div>"+value);
        this.innerHTML="delete";
        this.parentElement.style.backgroundColor="red";
    }
    else{
       this.parentElement.parentElement.parentElement.remove();
    }    
    $elem = $('#addAll')
    $('#form-ajouter-question-vf').append($elem.clone());
    $elem.remove();
})

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-question").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var endPoint = estModification ? "/api/v1/enseignant/question/modifier/" + idEspaceCours + "/" + idQuestion
            : "/api/v1/enseignant/question/ajouter/" + idEspaceCours

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
        success: function () {
            console.log("Ajouter-Modifier Question - OK");
            if (estModification) {
                window.location.href = "/enseignant/question/" + idEspaceCours;
            }
            else {
                $(form)[0].reset();
                showSuccessToast(estModification ? "La question a bien été modifier" : "La question a bien été ajouté");
            }
        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}