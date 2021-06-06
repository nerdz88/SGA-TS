// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function()
{
    //On fait juste send le form directement, pas besoin de JS
    //PS- Si c'est du JS spécifique à une page il faut faire un autre fichier JS 
    // document.querySelectorAll("button.connect").forEach(function(element)
    // {
    //     element.addEventListener("click", async function(val)
    //     {
    //         email = document.getElementById("email").value;
    //         password = document.getElementById("password").value;
    //         if(password==""){
    //             alert("Vous avez entré un mot de passe vide...");
    //         }
    //         else{await fetch('/api/v1/sga/login/'+email+'&'+password).then(function(response){
    //             if(response.status==500){
    //                // console.log(response.json.error); Faire afficher le bon message d'erreur du controller
    //                 alert("Vous avez entré un email invalide...");
    //             }else{
    //                 window.location.href="http://localhost:3000/api/v1/sga/index";
    //             }
    //         });}
    //     });
    // });

    // this.document.getElementById("accueil").addEventListener("click" , async function() {
    //     console.log("this button Accueil is working like a champ !!!!!!!!!!!!")
    //     window.location.href="http://localhost:3000/api/v1/sga/accueil";
    // })

});
