// This code was mostly created by PedroTech in his tutorial on YouTube
import "./App.css";
import { useState, useEffect } from "react"
import storage from "./firebaseConfig.js"
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";

function App() {
  // the name of the image that is being uploaded.
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  // Get image refs to to a display of all images
  const imagesListRef = ref(storage, "blogImages/");

  // Don't upload unless there is a file
  // blogImages is the folder where the image will be stored.
  const uploadFile = () => {
    if (!imageUpload) return;
    // add characters to the filename to make it unique with v4
    const imageRef = ref(storage, `blogImages/${imageUpload.name + v4()}`);
    // pass in the location and the image
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  // this is run at the opening of the page to display all images
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          // add the next URL to the end of the list
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}> Upload Image</button>
      {imageUrls.map((url) => {
        return <img src={url} />;
      })}
    </div>
  );
}

export default App;