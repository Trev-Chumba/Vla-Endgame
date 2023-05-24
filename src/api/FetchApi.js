import { BASE_URL } from './Endpoints';

const headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Bearer token');

// const upHeaders = new Headers();
// upHeaders.append('multipart/form-data')
//upHeaders.append('Authorization', 'Bearer token');


export const FetchApi = {
  post: (url, body, onComplete) => {
    console.log('SENDING REQUEST:::::' + BASE_URL + url);

    fetch(BASE_URL + url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((data) => {
        onComplete(true, data);
      
      })
      .catch((error) => {
        console.log(BASE_URL + url);
        console.log(error);
        onComplete(false, undefined);
      });
  },

  upload: (formData, onComplete) => {
    fetch(BASE_URL + '/upload', {
      method: 'POST',
     // headers: {"multipart/form-data"},
      body: formData
    })
      .then((response) => response.json())
      .then((data) => onComplete(true, data))
      .catch((error) => {
        console.log(BASE_URL + '/upload');
        console.log(error);
        onComplete(false, undefined);
      });
  },

  get: (url, onComplete) => {
    fetch(BASE_URL + url, {
      method: 'GET',
      headers: headers
    })
      .then((response) => {
        console.log(response);
        response.json();
      })
      .then((data) => onComplete(true, data))
      .catch((error) => {
        console.log('ERROR::::' + BASE_URL + url);
        console.log(error);
        onComplete(false, undefined);
      });
  }
};
