//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function()
{
    $("#form-ajouter-question").on("submit", function(e) {
        //On veut envoyer le formulaire!
        console.log("Envoyer formulaire - Ajax - Ajouter Question");
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/enseignant/question/ajouter',
            data: $(this).serialize(),
            success: function () {
                console.log("Ajouter Question - OK");
            },
            fail: function() {
                console.log("Ajouter Question - KO");
            }
        });

    });
   


   console.log("ajouter-question.js => Page Load");
});

