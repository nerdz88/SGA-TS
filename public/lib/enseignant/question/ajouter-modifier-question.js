//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {
    $("#form-ajouter-question").on("submit", function (e) {
        //On veut envoyer le formulaire!
        var form = this;

        var estModifiable = $(form).find('input[name="estModifiable"]').val() == "true";
        var idCoursGroupe = $(form).find('input[name="idCoursGroupe"]').val();
        var idQuestion = $(form).find('input[name="idQuestion"]').val();
        var endPoint = estModifiable ? "/enseignant/question/modifier/" + idQuestion
            : "/enseignant/question/groupe/" + idCoursGroupe + "/ajouter"

        console.log("Envoyer formulaire - Ajax - Ajouter Question");
        e.preventDefault();
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
                    //TODO LIONE METTRE DANS UN FUNCTION PLUS GÉNÉRAL
                    //https://kamranahmed.info/toast?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library
                    $.toast({
                        text: estModifiable ? "La question a bien été modifier" : "La question a bien été ajouté", // Text that is to be shown in the toast
                        heading: 'Succès', // Optional heading to be shown on the toast
                        icon: 'success', // Type of toast icon
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: true, // Boolean value true or false
                        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                        textAlign: 'left',  // Text alignment i.e. left, right or center
                        loaderBg: '#9EC600',  // Background color of the toast loader
                    });
                }
            },
            error: function () {
                console.log("Ajouter Question - KO");
                //TODO LIONE METTRE DANS UN FUNCTION PLUS GÉNÉRAL
                $.toast({
                    text: estModifiable ? "La question n'a pas bien été modifier" : "La question n'a pas été ajouté", // Text that is to be shown in the toast
                    heading: 'Erreur', // Optional heading to be shown on the toast
                    icon: 'error', // Type of toast icon
                    showHideTransition: 'fade', // fade, slide or plain
                    allowToastClose: true, // Boolean value true or false
                    hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                    stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left',  // Text alignment i.e. left, right or center
                    loaderBg: '#9EC600',  // Background color of the toast loader
                });
            }
        });

    });



    console.log("ajouter-question.js => Page Load");
});

