import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import * as Fire from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import * as Api from "./api.js";

const App = initializeApp(Api.FirebaseConfig);
const Db = Fire.getFirestore(App);
const UsersCollection = Fire.collection(Db, "users");

const SubmitButton = document.getElementById("SubmitButton");
const UsernameInput = document.getElementById("UsernameInput");
const PasswordInput = document.getElementById("PasswordInput");
const EmailInput = document.getElementById("EmailInput");

const UsernameLabel = document.getElementById("UsernameLabel");

const AccountLinkButtons = document.querySelectorAll(".AccountLinkButton");
const AccountUnlinkButtons = document.querySelectorAll(".AccountUnlinkButton");
const LogOutButton = document.getElementById("LogOutButton");

const AccountPage = document.querySelector(".Account");

AccountLinkButtons.forEach(async AccountLinkButton => {
    if (localStorage.getItem("User")) {
        const UserRef = await Api.User.Get("username", JSON.parse(localStorage.getItem("User")).username);
        if (!UserRef) {
            localStorage.removeItem("User");
            location.reload();
            return;
        } else {
            UsernameLabel.innerHTML = JSON.parse(localStorage.getItem("User")).username;
            AccountLinkButton.remove();
        }
    } else {
        UsernameLabel.remove();
        LogOutButton.remove();

        AccountLinkButton.addEventListener("click", () => {
            AccountPage.style.display = "";
            SubmitButton.innerHTML = AccountLinkButton.innerHTML;
        });

        SubmitButton.addEventListener("click", async () => {
            const Username = UsernameInput.value;
            const Password = PasswordInput.value;
            const Email = EmailInput.value;

            if (Username && Password && Email) {
                if (!await Api.User.Check("email", Email)) {
                    const UserData = {
                        email: Email,
                        username: Username,
                        password: Password,
                        timestamp: Math.floor(Date.now() / 1000),
                        pi: "",
                        plan: "Free"
                    };

                    await Api.User.Add(UserData, UserData.username);

                    localStorage.setItem("User", JSON.stringify(UserData));
                    location.reload();
                } else {
                    const UserRef = await Api.User.Get("username", Username);

                    if (UserRef.data().password === Password) {
                        localStorage.setItem("User", JSON.stringify(UserRef.data()));
                        location.reload();
                    }
                }
            }
        });
    }
});

AccountUnlinkButtons.forEach(AccountUnlinkButton => {
    AccountUnlinkButton.addEventListener("click", () => {
        AccountPage.style.display = "none";
    });
});

if (LogOutButton) {
    LogOutButton.addEventListener("click", () => {
        localStorage.removeItem("User");
        location.reload();
    });
}

if (UsernameLabel) {
    UsernameLabel.addEventListener("click", () => {
        location.href = "../profile.html"
    });
}