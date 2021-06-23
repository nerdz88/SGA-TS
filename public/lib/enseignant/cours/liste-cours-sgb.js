//Fichier Javascript pour la page de liste de cours d'un enseignant
let badges = document.getElementsByClassName("badgeDisponible");
setInterval(async ()=>{
   for(var i=0;i<badges.length;i++){
      let currentObject= badges[i];
      let attribut = currentObject.getAttribute("name");
      var endPoint = "/enseignant/cours/verifierDispo/"+attribut;
      $.ajax({
         type: "GET",
         url: endPoint,
         success: function (data) {
            currentObject.style.backgroundColor = data.estDisponible ? "green" : "red";
            currentObject.innerHTML=data.estDisponible ?"Disponible":"Indisponible";
         },
         error: function (e) {
            showErrorToast("erreur dans le sgb");
         }
      });
   }
},2000)
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
            showErrorToast(e.responseJSON.error);
         }
      });
   });




   console.log("liste-cours.js => Page Load");
});

