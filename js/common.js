/**
 * 404ページに遷移させる関数
 */
export function redirectTo404() {
  window.location.href = '/website/404.html';
}

/**
 * jsonからデータを取得する関数
 * @param {*} jsonPath 
 * @param {*} id 
 * @returns 
 */
export async function fetchDataById(jsonPath, id) {
  if (!id) {
    redirectTo404();
    return null;
  }
  try {
    const res = await fetch(jsonPath);
    const allData = await res.json();
    const data = allData[id];
    if (!data) {
      redirectTo404();
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    redirectTo404();
    return null;
  }
}
