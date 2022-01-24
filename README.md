<p align="center">
 <h1>File Uploader Service</h1>
</p>

This service handles file uploading to azure storage blob.
It consists of a three endpoints with which one of them allows you to submit a file and then get a response url.


## Quickstart


1. **Clone server repository** by copying the link and then cloning locally

```
git clone 	git@github.com-afrilogic:domey-afrilogic/file-uploader-az.git
cd file-uploader-az
```

2. **Install Dependencies.**

```
yarn
```

4. **Add Environment Variables**
- Duplicate .env.example and then add your variables:


4. **Start Service.**
-  For Development Mode
```
yarn dev or npm run dev
```
- For production mode
```
yarn start or npm start
```


6. **Access the upload endpoint via.

```
localhost:5000/upload :POST and req.body.image will take the file as form-data
```
