// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {

   $(".btn-submit-form").on("click", function(e) {
      e.preventDefault();  
      var btn = this;
      var form = $(btn).parent("form");
    
         
      var endPoint = "/api/v1/enseignant/cours/ajouter";
      $.ajax({
         type: "POST",
         url: endPoint,
         data: $(form).serialize(),
         success: function (data) {
            console.log("Login - OK");            
            window.location.href = "/enseignant/cours/detail/" + data.idEspaceCours;
         },
         error: function (e) {
             showErrorToast(e.responseJSON.error.message);
         }
      });
   });

   console.log("liste-cours.js => Page Load");
});

