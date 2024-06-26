import { Button, Chip, Image, Spinner } from "@nextui-org/react";
import FileImageOutlined from "@ant-design/icons/FileImageOutlined";
import CheckOutlined from "@ant-design/icons/CheckOutlined";
import RedoOutlined from "@ant-design/icons/RedoOutlined";
import ArrowLeftOutlined from "@ant-design/icons/ArrowLeftOutlined";

import { useEffect, useState } from "react";
function App() {
  const serverURL = process.env.API_ENDPOINT;
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
  const [showBMI, setShowBMI] = useState(false);
  const [bmi, setBmi] = useState(null);
  const [attribute, setAttribute] = useState("");

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
              isDisabled={!isOnline}
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
                // setFile(result);
                const formData = new FormData();
                formData.append("image", result);
                fetch(serverURL + "upload", {
                  method: "POST",
                  body: formData,
                })
                  .then((result) => result.json())
                  .then((data) => {
                    console.log(data);
                    setBmi(data.bmi);
                    if (data.bmi < 20) {
                      setAttribute("Underweight");
                    } else if (data.bmi >= 20 && data.bmi < 28) {
                      setAttribute("Normal weight");
                    } else {
                      setAttribute("Overweight");
                    }
                  });

                setIsPhotoSelected(true);
                const reader = new FileReader();
                reader.onload = (e) => {
                  setPhoto(e.target!.result);
                };
                reader.readAsDataURL(result);
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p>
              ML server is {isOnline && <Chip color="success">online</Chip>}
              {!isOnline && <Chip color="danger">offline</Chip>}
            </p>
            <p className="text-gray-400 p-4">
              The ML model is hosted on 2 GB memory on a 2 core CPU at an AWS
              datacenter in Mumbai.<br></br> So yeah, it's slow.
            </p>
          </div>
        </div>
      );
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
            {!showBMI && (
              <div className="flex gap-4 items-center">
                <Button
                  startContent={<CheckOutlined />}
                  color="success"
                  onPress={() => {
                    setShowBMI(true);
                  }}
                >
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
            )}
            {showBMI && (
              <>
                <div>
                  {bmi ? (
                    <div className="text-center">
                      <p>
                        BMI is <Chip>{bmi}</Chip>
                      </p>
                      <br />
                      <p>
                        <Chip color="warning">{attribute}</Chip>
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Spinner size="sm" />
                      <p>Loading</p>
                    </div>
                  )}
                </div>
                <Button
                  onPress={() => {
                    setIsPhotoSelected(false);
                    setShowBMI(false);
                    setBmi(null);
                  }}
                  color="secondary"
                  startContent={<ArrowLeftOutlined />}
                >
                  Go Back
                </Button>
              </>
            )}
          </div>
        </div>
      );
  }
}

export default App;
