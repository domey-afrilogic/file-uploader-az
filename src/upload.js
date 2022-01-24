import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} from "@azure/storage-blob";
import getStream from "into-stream";

const sasToken = process.env.AZURE_SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
const accountKey = process.env.ACCOUNT_KEY;
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(
  storageAccountName,
  accountKey
);
const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const createBlobInContainer = async (containerClient, file) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.originalname);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
  const stream = getStream(file.buffer);

  try {
    await blobClient.uploadStream(
      stream,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      options
    );
  } catch (err) {
    throw err;
  }
};

export const uploadFileToBlob = async (file) => {
  if (!file) return "";

  // get Container - full public read access
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: "container",
  });
  // upload file
  try {
    await createBlobInContainer(containerClient, file);
  } catch (error) {
    throw error;
  }
  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${file.originalname}`;
};
