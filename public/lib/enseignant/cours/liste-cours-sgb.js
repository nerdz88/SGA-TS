//Fichier Javascript pour la page de liste de cours d'un enseignant

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

   $(".form-ajouter-cours").on("submit", function (e) {
      //On veut envoyer le formulaire!
      e.preventDefault();
      var form = this;
      var endPoint = "/api/v1/enseignant/cours/ajouter";
      $.ajax({
         type: "POST",
         url: endPoint,
         data: $(form).serialize(),
         success: function (data) {
            console.log("Login - OK");            
            window.location.href = "/enseignant/cours/detail/" + data.coursInfo.sigle + "/" +  data.coursInfo.idCoursGroupe;
         },
         error: function () {
            console.log("Login - KO");
            showErrorToast("Erreur", "La cours n'a pas été ajouté");
         }
      });
   });



   console.log("liste-cours.js => Page Load");
});

