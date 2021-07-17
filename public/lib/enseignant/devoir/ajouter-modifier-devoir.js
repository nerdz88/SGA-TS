//Fichier Javascript pour la page d'ajout de cours

// Si vous modifiez ce fichier, exécutez "npm run build" pour que votre server utilise la nouvelle version. Sinon le navigateur conserve l'ancienne version en cache.
window.addEventListener("load", function () {


    $('.datepicker').each(function () {
        $(this).datepicker({
            /// https://materializecss.com/pickers.html Datepicker Internationalization options
            format: "dd-mm-yyyy",
            i18n: {
                months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                monthsShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
                weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
            }
        });

        if ($(this).val().length > 0) {
            var dateArray = $(this).val().split("-");
            var dateFormated = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));
            $(this).datepicker("setDate", dateFormated);
            $(this).datepicker("gotoDate", dateFormated);
        }

    });

    $("#form-ajouter-devoir").on("submit", function (e) {
        //On veut envoyer le formulaire!
        e.preventDefault();
        var form = this;
        var estModification = $(form).find('input[name="estModification"]').val() == "true";
        var idDevoir = $(form).find('input[name="idDevoir"]').val();
        var idEspaceCours = $(form).find('input[name="idEspaceCours"]').val();
        var endPoint = estModification ? "/api/v1/enseignant/devoir/modifier/" + idEspaceCours + "/" + idDevoir
            : "/api/v1/enseignant/devoir/ajouter/" + idEspaceCours

        console.log("Envoyer formulaire - Ajax - Ajouter/Modifier Question");
        envoyerFormulaireAjax(form, estModification, idEspaceCours, endPoint);
    });
    console.log("modifier-ajouter-devoir.js => Page Load");
});

function envoyerFormulaireAjax(form, estModification, idEspaceCours, endPoint) {
    $.ajax({
        type: "POST",
        url: endPoint,
        data: $(form).serialize(),
        success: function () {
            console.log("Ajouter-Modifier devoir - OK");
            if (estModification) {
                window.location.href = "/enseignant/devoir/" + idEspaceCours;
            }
            else {
                $(form)[0].reset();
                showSuccessToast(estModification ? "La devoir a bien été modifier" : "La devoir a bien été ajouté");
            }
        },
        error: function (e) {
            showErrorToast(e.responseJSON.error.message);
        }
    });
}