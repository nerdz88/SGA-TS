//Fichier Javascript pour la page de liste de cours d'un enseignant

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

    $(".btn-delete-cours").on("click", function () {      
        var noGroupe = $(this).data("noGroupe");
        var idGroupe = $(this).data("idGroupe");
        var sigle = $(this).data("sigle");
        $.confirm({
            title: 'Confirmation',
            backgroundDismiss: true,
            content: 'Voulez-vous vraiment supprimer ce cours: ' + sigle + " - gr:"+ noGroupe,
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: 'GET',
                        url: '/enseignant/cours/supprimer/' + sigle + "/" + idGroupe,
                        success: function () {
                            window.location.href = "/enseignant/question";
                        },
                        error: function () {
                            console.log("Supprimer Cours - KO");
                            //TODO LIONE METTRE DANS UN FUNCTION PLUS GÉNÉRAL
                            $.toast({
                                text: "Le cours n'a pas été supprimé", // Text that is to be shown in the toast
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
                }
            }
        });
    });


    console.log("liste-cours.js => Page Load");
});

