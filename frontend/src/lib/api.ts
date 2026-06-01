export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {

  let accessToken =
    localStorage.getItem("accessToken");

  // FIRST REQUEST
  
  let res = await fetch(url, {

    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // ACCESS TOKEN EXPIRED
  if (res.status === 401) {

    const refreshToken =
      localStorage.getItem("refreshToken");


    // REQUEST NEW ACCESS TOKEN
    const refreshRes = await fetch(
      "http://localhost:3001/auth/refresh",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      }
    );

    // REFRESH FAILED
    if (!refreshRes.ok) {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      throw new Error("Session expired");
    }

    const refreshData =
      await refreshRes.json();

    // SAVE NEW ACCESS TOKEN
    localStorage.setItem(
      "accessToken",
      refreshData.accessToken
    );

    accessToken = refreshData.accessToken;

    // RETRY ORIGINAL REQUEST
    res = await fetch(url, {
      ...options,

      headers: {
        ...options.headers,

        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return res;
};