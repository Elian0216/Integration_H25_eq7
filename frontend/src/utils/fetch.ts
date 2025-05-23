import Cookies from 'js-cookie';

/**
 * Envoie une requête POST à l'URL spécifiée avec les données fournies.
 *
 * @param url - L'URL vers laquelle envoyer la requête POST.
 * @param data - Les données à inclure dans le corps de la requête.
 * @returns La réponse de la requête fetch.
 *
 * Cette fonction utilise le token CSRF stocké dans les cookies pour sécuriser
 * la requête. Si le token n'est pas disponible, elle affiche une alerte d'erreur.
 * Ce token est nécessaire pour protéger contre les attaques CSRF, et donc nécessaire
 * pour que le backend accepte les requêtes POST.
 */

function postFetch(url: string, data: any) {
    // CSRF token
    const csrfToken = Cookies.get('csrftoken');
    if (!csrfToken) {
      alert("An error occured. " + csrfToken);
      return;
    }

    var res = fetch(url,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            'X-CSRFToken': csrfToken,
          }),
          credentials: "include",
          // Converti automatiquement en "username=example&password=password", plus facile à gérer pour Django.
          body: new URLSearchParams(data),
        }
      );
    return res;
}

/**
 * Vérifie si l'utilisateur est connecté.
 *
 * Envoie une requête GET vers l'endpoint "is-auth/" pour vérifier si l'utilisateur est connecté.
 * Si la requête est réussie, la fonction renvoie le booléen indiquant si l'utilisateur est connecté.
 * Si une erreur se produit, la fonction renvoie l'objet d'erreur.
 *
 * @returns Le booléen indiquant si l'utilisateur est connecté.
 */
async function checkAuth() {
  var data = null;
    try {
      const response = await fetch(process.env.API_PATH + "is-auth/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
       data = await response.json();
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      return error;
    }
    return data.bool;
  }

/**
 * Redirige l'utilisateur vers une URL spécifiée s'il n'est pas authentifié.
 *
 * Appelle la fonction `checkAuth` pour vérifier l'état d'authentification de l'utilisateur.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers l'URL fournie.
 *
 * @param url - L'URL vers laquelle rediriger si l'utilisateur n'est pas authentifié.
 */

function authProtection(url: string = "/") {
  checkAuth().then((bool) => {
    console.log(bool);
    if (!bool) {
      window.location.href = url;
    }
  });
}

export { postFetch, checkAuth, authProtection };


