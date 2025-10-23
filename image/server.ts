import express from "express";
import imageRouter from "./image-api";

const app = express();
app.use(express.json());

app.use("/api/image", imageRouter);

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Image API server running on port ${PORT}`);
});
