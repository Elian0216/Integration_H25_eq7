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

export default postFetch;
