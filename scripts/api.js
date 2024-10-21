import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import * as Storage from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import * as Fire from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export const FirebaseConfig = {
    apiKey: "AIzaSyA0LSrBjGvG8393udrdh6Aqd8hrccZUJjs",
    authDomain: "acecademy-6af2c.firebaseapp.com",
    projectId: "acecademy-6af2c",
    storageBucket: "acecademy-6af2c.appspot.com",
    messagingSenderId: "982111363322",
    appId: "1:982111363322:web:5594161a8f62bfffc3e943"
};

const App = initializeApp(FirebaseConfig);
const Db = Fire.getFirestore(App);
const UsersCollection = Fire.collection(Db, "users");

export class User {
    static async Check(From = "", Query = "") {
        const UserQuery = Fire.query(UsersCollection, Fire.where(From, "==", Query));
        const QuerySnapshot = await Fire.getDocs(UserQuery);
        return !QuerySnapshot.empty;
    }

    static async Get(From = "", Query = "") {
        const Filter = Fire.where(From, "==", Query);
        const UserQuery = Fire.query(UsersCollection, Filter);
        const QuerySnapshot = await Fire.getDocs(UserQuery);
    
        return QuerySnapshot.docs.length > 0 ? QuerySnapshot.docs[0] : null;
    }
    
    static async Add(UserData, Id) {
        const UserRef = Fire.doc(UsersCollection, Id);
        await Fire.setDoc(UserRef, UserData);
        return (UserRef.id, UserRef);
    }

    static async Update(NewData = {}) {
        const UserRef = (await User.Get("username", JSON.parse(localStorage.getItem("User")).username)).ref;
        await Fire.updateDoc(UserRef, NewData);
    }

    static async GetData(Override) {
        const UserRef = await User.Get("username", JSON.parse(localStorage.getItem("User")).username);
        return UserRef.data();
    }
}

export function FormatContent(Words = [], Parent = HTMLElement) {
    Words.forEach(Word => {
        let Element;

        if (Word.startsWith("<img>") && Word.endsWith("</img>")) {
            const ImageUrl = Word.replace("<img>", "").replace("</img>", "");
            Element = document.createElement("img");
            Element.src = ImageUrl;
        } else {
            Element = document.createElement("span");
            Element.textContent = Word;
        }

        if (Element) {
            Parent.appendChild(Element);
        }
    });
}

export async function UploadFile(File) {
    const StorageRef = Storage.ref(Storage.getStorage(), `uploads/${File.name}`);
    await Storage.uploadBytes(StorageRef, File);
    const ImageURL = await Storage.getDownloadURL(StorageRef);
    return ImageURL;
}