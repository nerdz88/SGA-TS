// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function()
{
    document.querySelectorAll("button.connect").forEach(function(element)
    {
        element.addEventListener("click", function(val)
        {
            email = document.getElementById("email").value;
            password = document.getElementById("password").value;
            alert("se connecte");
            fetch('/api/v1/sga/login/'+email+'&'+password).then(function(html){
                document.opend
                document.write(html)
                document.close
            });
        });
    });

    this.document.querySelectorAll("button.rechercherCours").forEach(function(element)
    {
        element.addEventListener("click", function(val){
            fetch('api/v1/sga/recupererCours', {
                headers: "tokentokentoken"
            })
        })
    } )

});
