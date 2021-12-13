var express = require('express');
var router = express.Router();

// ajout du module de génération de tokens jwt
const jwt = require('jsonwebtoken');

const users = [
  {
    nomUtilisateur:'ccroteau', 
    nom: 'Carine Croteau'
  }, 
  {
    nomUtilisateur:'bob', 
    nom : 'Bon ABC'
  }
]

function authentifierJeton(req, res, next){
  console.log("authentification en cours...");
  console.log(req.cookies);
  if(req.cookies.jeton) {
      console.log("Jeton" + req.cookies.jeton);
  }

  if(!req.cookies.jeton) return res.status('401').json({erreur:'Jeton d\'authentification manquant'});
  
  jwt.verify(req.cookies.jeton, process.env.SECRET, (err, nomUtilisateur) => {
    if(err) return res.status('403').json({erreur:'Jeton d\'authentification invalide'});
    console.log("validation du jeton avec succès");
    req.nomUtilisateur = nomUtilisateur;
    next();
  });
}

/* Obtenir l'utilisateur connecté. */
router.get('/', authentifierJeton, function(req, res, next) {  
  console.log('filtrer les utilisateur de ' + req.nomUtilisateur);
  res.json(users.filter(user => user.nomUtilisateur == req.nomUtilisateur));
});


router.post('/login', function(req, res, next) {
  // Récupérer nomUtilisateur motDePasse  
  const nomUtilisateur = req.body.nomUtilisateur;
  const motDePasse = req.body.motDePasse;

  // Dans cet exemple, supposons que le mot de passe valide est qwerty
  if(motDePasse == 'querty') {
    const jeton = jwt.sign(nomUtilisateur, process.env.SECRET);
    console.log("Création du jeton: " + jeton);
    res.cookie('jeton', jeton);
    res.json({login:'success'});
  } else {
    res.clearCookie('jeton');
    res.status('401').json('Erreur d\'authentification');
  }

});


module.exports = router;
