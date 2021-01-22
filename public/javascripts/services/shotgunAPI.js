function restCall(method, endpoint, token, data) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, endpoint, true);
    method === "GET"
      ? xhr.setRequestHeader("Content-Type", "application/json")
      : null;
    token ? xhr.setRequestHeader("Authorization", "Bearer " + token) : null;
    if (data) {
      if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.response);
        resolve(response);
      } else if (xhr.status !== 200) {
        reject(xhr.status);
      }
    };
  });
}

async function shotgunLogin() {
  return restCall("post", "/shotgun/login").then(data => {
    return JSON.parse(data).access_token;
  });
}

async function shotgunGetEntity(auth_token, entity_type, id) {
  return restCall(
    "get",
    "/shotgun/entity?type=" + entity_type + "&id=" + id,
    auth_token
  ).then(data => {
    return JSON.parse(data);
  });
}

export { shotgunGetEntity, shotgunLogin };
