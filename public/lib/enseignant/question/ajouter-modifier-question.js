//Fichier Javascript pour la page d'ajout de cours
$elementQuestion = $('#questionTotal').clone();
var reponseChoix = $(document).find('input[name="reponsesChoix"]').val()
if (reponseChoix != undefined) {
    let reponses = JSON.parse(reponseChoix);
    if (reponses.length > 0) {
        if (document.getElementById("tableauCorrespondance") != undefined) {
            var table = document.getElementById("tableauCorrespondance");
            var correspondances = JSON.parse($(document).find('input[name="correspondance"]')[0].value);
            for (var i = 0; i < correspondances.length; i++) {
                var row = table.insertRow(0);
                var cell = row.insertCell(0);
                cell.innerHTML = correspondances[i];
            }
        }
        addTextValues($('#questionTotal'), reponses[0]);
        if (reponses.length > 1) {
            for (var i = 1; i < reponses.length; i++) {
                $newElement = appendNewAnswer();
                if ($newElement != null) {
                    addTextValues($newElement, reponses[i])
                    $("#form-ajouter-question-vf").append($newElement);
                    moveBoutonAjouter();
                }

            }
        }


    }
}
M.updateTextFields();


function addTextValues($newElement, reponse) {
    if($newElement.find('input[name="reponses"]').length>0){
        var type = $newElement.find('input[name="reponses"]')[0].type;
        $newElement.find('input[name="reponses"]')[0][type == "checkbox" ? "checked" : "value"] = reponse.reponse;    
    }
    if (reponse.choix != null) {
        $newElement.find('input[name="choix"]')[0].value = reponse.choix;
    }
    if ($(document).find('input[name="correspondance"]').length > 0) {
        var elem = $newElement.find(".browser-default")[$newElement.find(".browser-default").length - 1];
        var correspondances = JSON.parse($(document).find('input[name="correspondance"]')[0].value);
        for (var i = 0; i < correspondances.length; i++) {
            var child = createOption(correspondances[i]);
            if (correspondances[i] == reponse.correspondance) {
                child.selected = "selected";
            }
            elem.appendChild(child);
        }
    }
    $newElement.find('textarea[name="descriptionReponse"]')[0].value = reponse.bonneReponseText;
    $newElement.find('textarea[name="descriptionMauvaiseReponse"]')[0].value = reponse.mauvaiseReponseText;
}

function appendNewAnswer() {
    $newElement = $elementQuestion.clone();
    if ($newElement != undefined && $newElement.find(".ajouterCourteQuestion").length != 0) {
        $newElement.find(".ajouterCourteQuestion")[0].innerHTML = "delete";
        $newElement.find(".ajouterCourteQuestion")[0].parentElement.style.backgroundColor = "red";
    }
    return $newElement;
}
$(document).on("click", ".ajouterCourteQuestion", function (e) {
    if (this.innerHTML == "add") {
        $("#form-ajouter-question-vf").append(appendNewAnswer());
        if ($(document).find(".browser-default").length != 0) {
            var values = $(document).find(".browser-default");
            for (var i = 1; i < values[0].children.length; i++) {
                values[values.length - 1].appendChild(createOption(values[0].children[i].value));
            }
        }
    }
    else {
        this.parentElement.parentElement.parentElement.remove();
    }
    moveBoutonAjouter();
    M.updateTextFields();
})


$(document).on("click", "#creerCorrespondance", function (e) {
    var correspondance = document.getElementById("valeurCorrespondance");
    if (correspondance.value != "") {
        var table = document.getElementById("tableauCorrespondance");
        var row = table.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerHTML = correspondance.value;
        var list = document.getElementsByClassName("browser-default");
        for (var i = 0; i < list.length; i++) {
            list[i].appendChild(createOption(correspondance.value));
        }
        correspondance.value = "";
    }
    M.updateTextFields();
})


function createOption(value) {
    var option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    M.updateTextFields();
    return option;
}

function moveBoutonAjouter() {
    $elem = $('#addAll')
    $('#form-ajouter-question-vf').append($elem.clone());
    $elem.remove();
    M.updateTextFields();
}

function buildFormat(type, form, idEspaceCours) {
    switch (type) {
        case "question-reponse-courte":
            return buildReponseCourte(type, form, idEspaceCours);
        case "question-vrai-faux":
            return buildQuestionVraiFaux(type, form, idEspaceCours);
        case "question-choix-multiples":
            return buildQuestionMultiple(type, form, idEspaceCours);
        case "question-numerique":
            return buildReponseCourte(type, form, idEspaceCours);
        case "question-mise-correspondance":
            return buildQuestionCorrespondance(type, form, idEspaceCours);
        case "question-essay":
            return buildReponseCourte(type, form, idEspaceCours);
    }

}

function buildQuestionCorrespondance(type, form, idEspaceCours) {
    $length = $(form).find('input[name="reponses"').length;
    let arrayReponses = [];
    let arrayCorrespondance = [];
    for (var i = 0; i < $length; i++) {
        let valueCorrespondance = form.getElementsByClassName("browser-default")[i].options[form.getElementsByClassName("browser-default")[i].selectedIndex].text;
        arrayReponses.push({
            reponse: form.getElementsByClassName("reponses")[i].value,
            descriptionReponse: form.getElementsByClassName("descriptionReponse")[i].value,
            descriptionMauvaiseReponse: form.getElementsByClassName("descriptionMauvaiseReponse")[i].value,
            correspondance: valueCorrespondance
        });
        arrayCorrespondance.push(valueCorrespondance);
    }
    return {
        typeQuestion: type,
        description: document.getElementById("question").value,
        tags: document.getElementById("tags").value,
        nom: document.getElementById("nom").value,
        idEspaceCours: idEspaceCours,
        reponses: JSON.stringify(arrayReponses),
        correspondances: JSON.stringify(arrayCorrespondance)
    };
}

function buildQuestionMultiple(type, form, idEspaceCours) {
    $length = $(form).find('.reponse').length;
    let arrayReponses = [];
    for (var i = 0; i < $length; i++) {
        arrayReponses.push({
            reponse: form.getElementsByClassName('filled-in')[i].checked,
            choix: form.getElementsByClassName("description")[i].value,
            descriptionReponse: form.getElementsByClassName("descriptionReponse")[i].value,
            descriptionMauvaiseReponse: form.getElementsByClassName("descriptionMauvaiseReponse")[i].value,
        });
    }
    return {
        typeQuestion: type,
        description: document.getElementById("questionDesciption").value,
        tags: document.getElementById("tags").value,
        nom: document.getElementById("nom").value,
        idEspaceCours: idEspaceCours,
        reponses: JSON.stringify(arrayReponses)
    };
}

function buildQuestionVraiFaux(type, form, idEspaceCours) {
    $length = $(form).find('.reponse').length;
    let arrayReponses = [];
    for (var i = 0; i < $length; i++) {
        arrayReponses.push({
            reponse: form.getElementsByClassName('inputLever')[i].checked,
            descriptionReponse: form.getElementsByClassName("descriptionReponse")[i].value,
            descriptionMauvaiseReponse: form.getElementsByClassName("descriptionMauvaiseReponse")[i].value,
        });
    }
    return {
        typeQuestion: type,
        description: document.getElementById("question").value,
        tags: document.getElementById("tags").value,
        nom: document.getElementById("nom").value,
        idEspaceCours: idEspaceCours,
        reponses: JSON.stringify(arrayReponses)
    };
}

function buildReponseCourte(type, form, idEspaceCours) {
    $length = $(form).find('input[name="reponses"').length;
    let arrayReponses = [];
    for (var i = 0; i < $length; i++) {
        arrayReponses.push({
            reponse: form.getElementsByClassName("reponses")[i].value,
            descriptionReponse: form.getElementsByClassName("descriptionReponse")[i].value,
            descriptionMauvaiseReponse: form.getElementsByClassName("descriptionMauvaiseReponse")[i].value,
        });
    }
    return {
        typeQuestion: type,
        description: document.getElementById("question").value,
        tags: document.getElementById("tags").value,
        nom: document.getElementById("nom").value,
        idEspaceCours: idEspaceCours,
        reponses: JSON.stringify(arrayReponses)
    };
}

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-question-vf").on("submit", function (e, req) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var typeQuestion = $(form).find('input[name="typeQuestion"]').val();
        var endPoint = estModification ? "/api/v1/enseignant/question/modifier/" + idEspaceCours + "/" + idQuestion
            : "/api/v1/enseignant/question/ajouter/" + idEspaceCours

        let format = buildFormat(typeQuestion, form, idEspaceCours);
        console.log("Envoyer formulaire - Ajax - Ajouter/Modifier Question");
        envoyerFormulaireAjax(form, format, estModification, idEspaceCours, endPoint);
    });
    M.updateTextFields();
    console.log("ajouter-question.js => Page Load");
});

function envoyerFormulaireAjax(form, data, estModification, idEspaceCours, endPoint) {
    $.post({
        type: estModification ? "PUT" : "POST",
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