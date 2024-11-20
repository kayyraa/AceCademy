import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import * as Storage from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import * as Fire from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import * as Api from './api.js';

const App = initializeApp(Api.FirebaseConfig);
const Db = Fire.getFirestore(App);

const UsernameLabel = document.querySelector(".UsernameLabel");
const UserProfileImages = Array.from(document.querySelectorAll(".UserProfileImage"));

const ProfileImageInput = document.getElementById("ProfileImageInput");

const SaveChangesButton = document.getElementById("SaveChangesButton");

const UserData = await Api.User.GetData();
UsernameLabel.innerHTML = UserData.username;
UserProfileImages.forEach(UserProfileImage => {UserProfileImage.src = UserData.pi !== "" ? UserData.pi : "../images/DefaultUser.svg";});

SaveChangesButton.addEventListener("click", async () => {
    const File = ProfileImageInput.files[0];
    if (File) {
        const ImageURL = await Api.UploadFile(File);
        
        var CurrentUserData = JSON.parse(localStorage.getItem("User"));
        CurrentUserData.pi = ImageURL;

        await Api.User.Update(CurrentUserData);

        localStorage.setItem("User", JSON.stringify(CurrentUserData));
        location.reload();
    }
});