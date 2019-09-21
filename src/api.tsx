const endpoints = {
  login: 'https://foodsharing.de/api/user/login'
}

export enum results {
  CONNECTION_ERROR,
  SERVER_ERROR,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED
}

function request(endpoint, data) {
  return fetch(endpoints[endpoint], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(response => {
    console.log(response)
    return response.json()
  })
}


export async function authenticate(email, password): Promise<results> {
  try {
    const data  = await request('login', {email, password})

    switch(data.code) {
      case 200:
        return results.LOGIN_SUCCESSFUL

      case 401:
        return results.LOGIN_FAILED

      default:
        return results.SERVER_ERROR
    }
  } catch(e) {
    console.log(e)

    return results.CONNECTION_ERROR
  }
}