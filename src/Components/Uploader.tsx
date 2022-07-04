import React from "react";
import { FileImageFilled } from "@ant-design/icons";
import {
  Upload,
  UploadProps,
  Card,
  UploadFile,
  Spin,
  Result,
  Button,
  Image,
  message,
} from "antd";
import { isEqual } from "lodash";
import { UploadChangeParam } from "antd/lib/upload";
import {
  cardHeaderStyles,
  cardHelpTextStyles,
  cardStyles,
  imageStyles,
  resultStyles,
  separatorStyles,
  uploadButtonStyles,
} from "../styles.constant";

const { Dragger } = Upload;

const Uploader = () => {
  const [file, setFile] = React.useState<UploadFile>({} as UploadFile);

  const isUploading = React.useMemo(
    () => isEqual(file?.status, "uploading"),
    [file]
  );

  const isDone = React.useMemo(() => isEqual(file?.status, "done"), [file]);

  const onFileUploadChange = (info: UploadChangeParam) => {
    const supportedTypes = ["image/png", "image/jpeg"];
    if (supportedTypes.includes(info.file?.type as string)) {
      setFile(info.file);
    } else {
      message.error("File should be jpeg, png");
    }
  };

  const onRequestUpload = (options: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(options.file);
    reader.addEventListener("load", (e) => {
      setTimeout(() => {
        options.onSuccess(e.target);
      }, 1000);
    });
  };

  const onCopyImage = async () => {
    try {
      const base64Response = await fetch(file.response?.result);
      const blob = await base64Response.blob();
      navigator.clipboard.write([
        new ClipboardItem({
          [file.type ?? "image/png"]: blob,
        }),
      ]);
      message.success("Image copied successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const props: UploadProps = {
    accept: "image/png, image/jpeg",
    multiple: false,
    type: "drag",
    customRequest: onRequestUpload,
    showUploadList: false,
    onChange: onFileUploadChange,
  };

  return (
    <Card style={cardStyles}>
      {!isDone ? (
        <React.Fragment>
          <h2 style={cardHeaderStyles}>
            {isUploading ? "Uploading..." : "Upload your image"}
          </h2>

          <div style={cardHelpTextStyles}>
            {isUploading ? (
              <Spin size="large" />
            ) : (
              "File should be jpeg, png..."
            )}
          </div>

          <Dragger {...props} disabled={isUploading}>
            <p className="ant-upload-drag-icon">
              <FileImageFilled />
            </p>
            <p className="ant-upload-text">Drag &amp; drop your image here</p>
          </Dragger>

          <p style={separatorStyles}>Or</p>

          <Upload {...props} type="select" disabled={isUploading}>
            <Button
              type="primary"
              disabled={isUploading}
              style={uploadButtonStyles}
            >
              Click to Upload
            </Button>
          </Upload>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Result
            status="success"
            title="Uploaded Successfully!"
            extra={[
              <Image
                key="preview-image"
                preview={false}
                src={file?.response?.result}
                style={imageStyles}
              />,
              <Button type="primary" key="console" onClick={onCopyImage}>
                Copy
              </Button>,
              <Button key="buy" onClick={() => setFile({} as UploadFile)}>
                Try Again
              </Button>,
            ]}
            style={resultStyles}
          />
        </React.Fragment>
      )}
    </Card>
  );
};

export default Uploader;
