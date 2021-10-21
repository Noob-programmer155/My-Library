//mainURL
export const mainURL= "http://localhost:8895";

//user
export const verUser = mainURL+"/user/get";
export const signUp = mainURL+"/user/signup";
export const logIn = mainURL+"/user/login";
export const pathOauth = mainURL+"/login/auth";

//verify User
export const valDefault = mainURL+"/user/validate";
export const valOauth = mainURL+"/user/verify-oauth";

//book
export const mainBookURL = mainURL+"/book/getbooks";
export const modifyBookURL = mainURL+"/book/modifybook";
export const modifyBookFavURL = mainURL+"/book/modifybook/add";
