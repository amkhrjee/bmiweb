import { Button, Chip, Image } from "@nextui-org/react";
import FileImageOutlined from "@ant-design/icons/FileImageOutlined";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import RedoOutlined from "@ant-design/icons/RedoOutlined";
import { useEffect, useState } from "react";
function App() {
  const serverURL = "http://127.0.0.1:8000/";
  useEffect(() => {
    fetch(serverURL + "test")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setIsOnline(true);
      })
      .catch((err) => {
        console.error(err);
      });
  });
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [photo, setPhoto] = useState<string | ArrayBuffer | null>("");
  const [isOnline, setIsOnline] = useState(false);

  function triggerInput(): void {
    document.getElementById("image_picker")?.click();
  }

  switch (isPhotoSelected) {
    case false:
      return (
        <div className="h-screen  flex m-auto justify-evenly text-center items-center flex-col">
          <div>
            <p className="p-4 text-gray-400">
              Simply pick a photo from your gallery or click a picture to know
              whether someone is malnourished or not.
            </p>
            <Button
              startContent={<FileImageOutlined />}
              color="primary"
              variant="shadow"
              onPress={() => triggerInput()}
            >
              Click a photo or choose from gallery
            </Button>
            <input
              id="image_picker"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const result = e.target.files![0];
                setIsPhotoSelected(true);
                const reader = new FileReader();
                reader.onload = (e) => {
                  setPhoto(e.target!.result);
                };
                reader.readAsDataURL(result);
              }}
            />
          </div>
          <p>
            ML server is {isOnline && <Chip color="success">online</Chip>}
            {!isOnline && <Chip color="danger">offline</Chip>}
          </p>
        </div>
      );
      break;
    case true:
      return (
        <div className="h-screen flex mx-auto items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-8">
            <Image
              isBlurred
              width={350}
              src={photo as string}
              alt="NextUI Album Cover"
            />
            <div className="flex gap-4 items-center">
              <Button startContent={<CheckOutlined />} color="success">
                OK
              </Button>
              <Button
                startContent={<RedoOutlined />}
                color="danger"
                onPress={() => {
                  setIsPhotoSelected(false);
                }}
              >
                Select a different one
              </Button>
            </div>
          </div>
        </div>
      );
  }
}

export default App;