import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import * as Fire from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import * as Api from "./api.js";

const App = initializeApp(Api.FirebaseConfig);
const Db = Fire.getFirestore(App);
const PostsCollection = Fire.collection(Db, "posts");
const QueryList = document.querySelector(".QueryList");

const TitleInput = document.getElementById("TitleInput");
const ContentInput = document.getElementById("ContentInput");
const PostTypeInput = document.getElementById("PostTypeInput");

const MediaButton = document.getElementById("MediaButton");
const SendButton = document.getElementById("SendButton");

function GenerateQueries(Document) {
    Array.from(QueryList.querySelector("div")).forEach(QueryItem => {
        QueryItem.remove();
    });
    Array.from(QueryList.getElementsByTagName("i")).forEach(QueryItem => {
        QueryItem.style.opacity = "0";
        setTimeout(() => {
            QueryItem.remove();
        }, 750);
    });

    const DocData = Document.data();

    const QueryItem = document.createElement("div");
    QueryItem.style.order = DocData.timestamp;
    QueryList.appendChild(QueryItem);

    const HeaderItem = document.createElement("div");
    QueryItem.appendChild(HeaderItem);

    const TestImage = document.createElement("img");
    TestImage.src = `../images/${DocData.type}.svg`;
    HeaderItem.appendChild(TestImage);

    const Header = document.createElement("header");
    Header.innerHTML = DocData.title;
    HeaderItem.appendChild(Header);

    const ContentContainer = document.createElement("div");
    ContentContainer.style.display = "none";
    QueryItem.appendChild(ContentContainer);

    const Content = document.createElement("p");
    ContentContainer.appendChild(Content);

    Api.FormatContent(DocData.content.split(" "), Content);

    QueryItem.onclick = (Event) => {
        if (Event.target !== Header) return;
        ContentContainer.style.display = getComputedStyle(ContentContainer).display === "none" ? "" : "none";
    };

    Array.from(ContentContainer.querySelector("img")).forEach(Image => {
        Image.onclick = () => {
            window.open(Image.src);
        };
    });
}

async function FetchTests() {
    const QuerySnapshot = await Fire.getDocs(PostsCollection);
    QuerySnapshot.forEach((Doc) => {
        GenerateQueries(Doc);
    });
}

FetchTests();

MediaButton.addEventListener("click", () => {
    const Input = document.createElement("input");
    Input.type = "file";
    Input.accept = "image/*";

    Input.click();

    Input.onchange = async () => {
        const File = Input.files[0];
        if (File) {
            const ImageURL = Api.UploadFile(File);
            ContentInput.value += `${ContentInput.value ? "" : " "}<img>${ImageURL}</img>`;
        }
    };
});

SendButton.addEventListener("click", async () => {
    const Title = TitleInput.value;
    const Content = ContentInput.value;
    const Type = PostTypeInput.value;

    if (Title && Content && Type !== "Select Type") {
        const PostData = {
            title: Title,
            content: Content,
            type: Type,
            timestamp: Math.floor(Date.now() / 1000),
        };

        const DocRef = Fire.doc(PostsCollection);
        await Fire.setDoc(DocRef, PostData);
        location.reload();
    }
});