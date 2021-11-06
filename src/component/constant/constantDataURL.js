//mainURL
export const mainURL= "http://localhost:8895";

//user
export const verUserURL = mainURL+"/user/get";
export const signUpURL = mainURL+"/user/signup";
export const logInURL = mainURL+"/user/login";
export const pathOauthURL = mainURL+"/login/auth";
export const getUsersURL = mainURL+"/user/getalluser";
export const getAdminURL = mainURL+"/user/getalladmin";
export const addUserOnlineURL = mainURL+"/user/adduseronline";
export const deleteUserOnlineURL = mainURL+"/user/delete/useronline";
export const getUserOnlineURL = mainURL+"/user/getuseronline";

//verify User
export const valDefaultURL = mainURL+"/user/validate";
export const valOauthURL = mainURL+"/user/verify-oauth";

//book
export const mainBookURL = mainURL+"/book/getbooks";
export const modifyBookURL = mainURL+"/book/modifybook";
export const modifyBookFavURL = mainURL+"/book/modifybook/fav";
export const modifyBookRekURL = mainURL+"/book/rekomendation";
export const getMyBookURL = mainURL+"/book/getMyBook";
export const addBookURL = mainURL+"/book/addbook";
export const modifBookURL = mainURL+"/book/modifybook";
export const deleteBookURL = mainURL+"/book/delete";

//type Book
export const getBookTypeURL = mainURL+"/book/getType";
export const addBookTypeURL = mainURL+"/book/addTypes";

//image
export const imageBookURL = mainURL+"/book/image/";
export const fileBookURL = mainURL+"/book/file/";
export const imageUserURL = mainURL+"/user/image/";
