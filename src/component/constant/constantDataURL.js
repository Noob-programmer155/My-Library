//mainURL
export const mainURL= "http://localhost:8895";

//user
export const verUserURL = mainURL+"/user/get";
export const signUpURL = mainURL+"/user/signup";
export const logInURL = mainURL+"/user/login";
// export const pathOauthURL = mainURL+"/user/login";
export const getUsersURL = mainURL+"/user/getalluser";
export const getAdminURL = mainURL+"/user/getalladmin";
export const addUserOnlineURL = mainURL+"/user/adduseronline";
export const deleteUserOnlineURL = mainURL+"/user/delete/useronline";
export const getUserOnlineURL = mainURL+"/user/getuseronline";
export const deleteUserURL = mainURL+"/user/delete";
export const deleteAdminURL = mainURL+"/user/delete/admin";
export const verifyPasswordURL = mainURL+"/user/password";
export const changePasswordURL = mainURL+"/user/password/change";
export const logOutURL = mainURL+"/user/logout";
export const upgradeAdminURL = mainURL+"/user/modify/admin";
export const upgradeUserURL = mainURL+"/user/modify/seller";
export const modifyUserURL = mainURL+"/user/modify";

//verify User
export const valDefaultURL = mainURL+"/user/validate";
export const valOauthURL = mainURL+"/user/verify-oauth";

//book
export const mainBookURL = mainURL+"/book/getbooks";
export const mainBookUserURL = mainURL+"/book/getBooksUser";
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

//fileandimage
export const imageBookURL = mainURL+"/book/image/";
export const fileBookURL = mainURL+"/book/file/";
export const imageUserURL = mainURL+"/user/image/";
