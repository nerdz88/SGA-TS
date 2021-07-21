//Fichier Javascript pour la page d'ajout de cours
$elementQuestion=$('#questionTotal').clone();

var reponseChoix = $(document).find('input[name="reponsesChoix"]').val()
if(reponseChoix!=undefined){
    let reponses = JSON.parse(reponseChoix);
    addTextValues($('#questionTotal'),reponses[0]);
    if(reponses.length>1){
        for(var i=1;i<reponses.length;i++){
            $newElement = appendNewAnswer();
            if($newElement!=null){
                addTextValues($newElement,reponses[i])
                $("#form-ajouter-question-vf").append($newElement);
                moveBoutonAjouter();
            }
            
        }
    }
}

function addTextValues($newElement,reponse){
    $newElement.find('input[name="reponses"]')[0].value=reponse.reponse;
    $newElement.find('textarea[name="descriptionReponse"]')[0].value=reponse.bonneReponseText;
    $newElement.find('textarea[name="descriptionMauvaiseReponse"]')[0].value=reponse.mauvaiseReponseText;
}

function appendNewAnswer(){
    $newElement = $elementQuestion.clone();
    if($newElement!=undefined && $newElement.find(".ajouterCourteQuestion").length!=0){
        $newElement.find(".ajouterCourteQuestion")[0].innerHTML="delete";
        $newElement.find(".ajouterCourteQuestion")[0].parentElement.style.backgroundColor="red";
    }
    return $newElement;
}
$(document).on("click",".ajouterCourteQuestion", function(e){
    if(this.innerHTML=="add"){
        $("#form-ajouter-question-vf").append(appendNewAnswer());
    }
    else{
       this.parentElement.parentElement.parentElement.remove();
    }    
    moveBoutonAjouter();
})

function moveBoutonAjouter(){
    $elem = $('#addAll')
    $('#form-ajouter-question-vf').append($elem.clone());
    $elem.remove();
}
// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-question-vf").on("submit", function (e,req) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var typeQuestion = $(form).find('input[name="typeQuestion"]').val();
        var endPoint = estModification ? "/api/v1/enseignant/question/modifier/" + idEspaceCours + "/" + idQuestion
            : "/api/v1/enseignant/question/ajouter/" + idEspaceCours
        

        console.log("Envoyer formulaire - Ajax - Ajouter/Modifier Question");
        $length = $(form).find('input[name="reponses"').length;
        let arrayReponses=[];
        for(var i=0;i<$length;i++){
            arrayReponses.push({
                reponse:form.getElementsByClassName("reponses")[i].value,
                descriptionReponse:form.getElementsByClassName("descriptionReponse")[i].value,
                descriptionMauvaiseReponse:form.getElementsByClassName("descriptionMauvaiseReponse")[i].value,
            })
        }

        let format ={
            typeQuestion:typeQuestion,
            description:document.getElementById("question").value,
            tags:document.getElementById("tags").value,
            nom:document.getElementById("nom").value,
            idEspaceCours:idEspaceCours,
            reponses:JSON.stringify(arrayReponses)
        }
        envoyerFormulaireAjax(form,format, estModification, idEspaceCours, endPoint);
    });
    console.log("ajouter-question.js => Page Load");
});

function envoyerFormulaireAjax(form,data, estModification, idEspaceCours, endPoint) {
    $.post({
        type: "POST",
        url: endPoint,
        data: data,
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