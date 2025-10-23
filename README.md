docker build -t story-generator .

docker run -d -p 5173:5173 story-generator:latest