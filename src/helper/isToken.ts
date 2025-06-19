export function IsToken() {
  const token = localStorage.getItem("token");
  return token && token != undefined && token != null ? true : false;
}
