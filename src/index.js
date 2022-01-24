import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import { uploadFileToBlob } from "./upload";

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.get("/", function (_, res) {
  res.send(
    "Server For Uploading Images. Hit /upload with a POST request and pass image as key with binary as value!"
  );
});

app.get("/ping", function (_, res) {
  res.send("PONG");
});

app.post("/upload", upload.single("image"), async function (req, res, next) {
  let file = req.file;

  if (!file) {
    const err = new Error("Kindly add an image");
    err.status = 400;
    return next(err);
  }

  file = {
    ...file,
    originalname:
      Date.now() +
      Math.round(Math.random() * 1e9) +
      "." +
      file.mimetype.split("/")["1"],
  };

  try {
    const response = await uploadFileToBlob(file);
    return res.status(200).json({
      ok: true,
      data: {
        url: response,
      },
    });
  } catch (error) {
    const err = new Error(error.message);
    err.status = 400;
    return next(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === "development") {
  app.use(function (err, _, res) {
    res.status(err.status || 500);
    res.json({
      ok: false,
      error_message: err.message,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, _, res) {
  res.status(err.status || 500);
  res.json({
    ok: false,
    error_message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Started express server on port ${PORT}...`);
});
