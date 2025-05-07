import Cookies from 'js-cookie';

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
          // Converti automatiquement en "username=example&password=password"
          body: new URLSearchParams(data),
        }
      );
    return res;
}

async function checkAuth() {
  var data= null;
    try {
      const response = await fetch("/api/is-auth/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
       data = await response.json();
    } catch (error) {
      console.error("Errur lors de la vérification de l'authentification:", error);
      return error;
    }
    return data.bool;
  }

export default postFetch; checkAuth;


