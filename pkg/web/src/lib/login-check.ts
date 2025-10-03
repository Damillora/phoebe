const isTokenExpired = (token: string) => {
  if (token === "" || token === undefined) return true;
  const tokenData = JSON.parse(atob(token.split(".")[1]));
  const expiry = tokenData.exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};
const getUsernameFromToken = (token: string) => {
  if (token === "" || token === undefined) return "Guest";

  const isExpired = isTokenExpired(token);

  if (!isExpired) {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.name;
  }
  return "Guest";
};

export { isTokenExpired, getUsernameFromToken };
