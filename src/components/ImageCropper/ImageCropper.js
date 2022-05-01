import React, { useState, useCallback } from "react";

import Cropper from "react-easy-crop";

import {
  Button,
  Pane,
  Paragraph,
  Spinner,
  FilePicker,
  majorScale,
  toaster,
} from "evergreen-ui";

import { ConfirmActionDialog } from "../";

import getCroppedImg from "../../utils/crop-image";
import { uploadArtistPhoto } from "../../utils/artists";

import styles from "./ImageCropper.module.css";

export const ImageCropper = ({ setImageUrl }) => {
  const [zoom, setZoom] = useState(1);
  const [img, setImg] = useState(null);
  const [image, setImage] = useState(null); // Image file
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState("idle");
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleUpload = () => {
    const { width, height, x: left, y: top } = croppedAreaPixels;
    const data = { image, width, height, left, top };

    setStatus("pending");

    uploadArtistPhoto(data).then(
      (data) => {
        toaster.closeAll();
        toaster.success("Successfully uploaded!");
        setStatus("resolved");
        setImageUrl(data?.data?.url);
        setDeleteUrl(data?.data?.deleteUrl);
      },
      (error) => {
        setStatus("rejected");
        console.error(error);
        const errorResponse = error?.response?.data;
        toaster.closeAll();
        if (errorResponse) {
          toaster.danger(errorResponse?.error ?? errorResponse?.message);
        } else {
          toaster.danger("Error uploading photo. Please try again.");
        }
      }
    );
  };

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        img,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, img]);

  const readImageAndSet = (imgFile) => {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setImg(reader.result);
    });
    reader.readAsDataURL(imgFile);
  };

  const handleFileChange = (files) => {
    if (files.length === 0) {
      toaster.closeAll();
      toaster.notify("Please select an image!");

      return;
    }
    setImage(files[0]);
    readImageAndSet(files[0]);
  };

  const handleRemoveSelectedPhoto = () => {
    setImg(null);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setCroppedImage(null);
    setCroppedAreaPixels(null);
    setDeleteUrl(null);
    setStatus("idle");
    setImageUrl("");
  };

  return (
    <>
      {!croppedImage && !img && (
        <>
          <FilePicker
            width={250}
            onChange={handleFileChange}
            placeholder="Select the file here!"
            accept="image/*"
          />
        </>
      )}

      {!croppedImage && img && (
        <>
          <Pane position="relative" height={400}>
            <Cropper
              image={img}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={19 / 6}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </Pane>
          <Pane display="flex" gap="10px">
            <Button
              marginTop={16}
              intent="success"
              appearance="primary"
              onClick={(e) => {
                e.preventDefault();
                showCroppedImage();
              }}
            >
              Done Cropping
            </Button>
            <ConfirmActionDialog
              actionBtnText="Remove Selected Photo"
              actionInfo="Are you sure you want to remove the selected photo?"
              actionConfirmBtnText="Remove"
              proceedActionFunc={handleRemoveSelectedPhoto}
            />
          </Pane>
        </>
      )}
      {croppedImage && (
        <>
          <Paragraph display="block" marginBottom={majorScale(2)}>
            Artist Cover Image Preview
          </Paragraph>
          <Pane position="relative">
            {status === "pending" && (
              <Pane
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner size={majorScale(5)} />
                <Paragraph marginLeft={majorScale(2)}>
                  Uploading photo...
                </Paragraph>
              </Pane>
            )}
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className={styles["image-preview"]}
              style={status === "pending" ? { opacity: 0.1 } : {}}
            />
          </Pane>
          {status !== "pending" && status !== "resolved" && (
            <Pane marginBottom={majorScale(2)} display="flex" gap="10px">
              <Button
                marginTop={16}
                onClick={() => {
                  setCroppedImage(null);
                  setCroppedAreaPixels(null);
                }}
              >
                Crop Again
              </Button>
              <ConfirmActionDialog
                actionBtnText="Upload Photo Now"
                actionInfo="Are you sure you want to upload the cropped photo?"
                actionConfirmBtnText="Upload Now"
                proceedActionFunc={handleUpload}
                intent="success"
              />
            </Pane>
          )}
          {status === "resolved" && (
            <>
              <a
                href={deleteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowRemoveBtn(true)}
              >
                Please click here to delete the uploaded photo.
              </a>
              {showRemoveBtn && (
                <ConfirmActionDialog
                  actionBtnText="Reselect a cover photo"
                  actionInfo="Are you sure you want to use another photo? Please also be sure to delete the photo from uploads using the link given."
                  proceedActionFunc={handleRemoveSelectedPhoto}
                  intent="danger"
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
