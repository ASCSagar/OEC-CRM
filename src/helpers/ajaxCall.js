function ajaxCall(subUrl, header, method, postData) {
  // console.log(`url is : https://flyurdream.online/api/${subUrl}`);
  return fetch(`https://smhri.com/oeccrm/api/${subUrl}`, {
    headers: header,
    method: method,
    body: postData,
  })
    .then((response) => {
      // console.log("response is", response);
      if (!response.ok) {
        return {
          status: response.status,
          notOk: true,
          isNetwork: false,
          error: "",
        };
        // throw new Error("Network response was not OK" + response.ok);
      }
      return response.json();
    })
    .catch((err) => ({
      status: null,
      notOk: true,
      isNetwork: true,
      error: "",
    }));
}

function ajaxCallWithoutBody(subUrl, header, method) {
  // console.log(`url is : https://flyurdream.online/api/${subUrl}`);
  return fetch(`https://smhri.com/oeccrm/api/${subUrl}`, {
    headers: header,
    method: method,
  })
    .then((response) => {
      // console.log(subUrl);
      // console.log("status is", response.status);
      if (response.status === 204 || response.status === 404) {
        return true;
      }
      return {
        status: response.status,
        notOk: true,
        isNetwork: false,
        error: "",
      };
    })
    .catch((err) => ({
      status: null,
      notOk: true,
      isNetwork: true,
      error: "",
    }));
}

function ajaxCallWithHeaderOnly(subUrl, header) {
  // console.log(`url is : https://flyurdream.online/api/${subUrl}`);
  return fetch(`https://smhri.com/oeccrm/api/${subUrl}`, {
    headers: header,
  })
    .then((response) => {
      // console.log("response is", response);
      if (!response.ok) {
        return {
          status: response.status,
          notOk: true,
          isNetwork: false,
          error: "",
        };
      }
      if (response.status === 204) {
        return {
          status: response.status,
          notOk: true,
          isNetwork: false,
          error: "",
        };
      }
      return response.json();
    })
    .catch((err) => ({
      status: null,
      notOk: true,
      isNetwork: true,
      error: "",
    }));
}

function ajaxCallWithHeader(subUrl, header) {
  // console.log(`url is : https://flyurdream.online/api/${subUrl}`);
  return fetch(`https://smhri.com/oeccrm/api/${subUrl}`, {
    headers: header,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      // console.log(response);
      return response.json();
    })
    .catch((err) => console.log(err));
}

function ajaxCallUnauthorized(subUrl, header, method, postData) {
  // console.log(`url is : https://flyurdream.online/api/${subUrl}`);
  return fetch(`https://smhri.com/oeccrm/api/${subUrl}`, {
    headers: header,
    method: method,
    body: postData,
  })
    .then((response) => {
      // console.log("response is", response);
      if (response.status === 401) {
        return -1;
      }
      if (response.status === 200) {
        return response.json();
      }
      return -1;
    })
    .catch((err) => console.log(err));
}
export {
  ajaxCall,
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
  ajaxCallUnauthorized,
  ajaxCallWithHeader,
};
