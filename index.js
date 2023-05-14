//Variáveis
const accountSid = "ACba290466c5e685a736647d97d8378da9";
const authToken = "ede94bb6de30c0027107f5cf23cf7d7a";
const twilio = require("twilio");
const client = new twilio(
  ACba290466c5e685a736647d97d8378da9,
  ede94bb6de30c0027107f5cf23cf7d7a
);
const { google } = require("googleapis");

//Chave API YouTube
const youtube = google.youtube({
  version: "v3",
  auth: "YAIzaSyDSB6u1wQI2xt-Cq5W95XwuOSSffL3VdC8",
});

// Número AlphaBot SandBox
function sendMessage(to, message) {
  client.messages.create({
    from: "whatsapp:+14155238886",
    to: to,
    body: message,
  });
}

function searchVideo(query, sender) {
  youtube.search.list(
    {
      part: "id",
      q: query,
      type: "video",
    },
    (err, response) => {
      if (err) {
        console.error(err);
        sendMessage(sender, "Ocorreu um erro ao procurar o vídeo");
      } else {
        if (response.data.items.length === 0) {
          sendMessage(sender, "Não foi possível encontrar o vídeo");
          return;
        }
        const videoId = response.data.items[0].id.videoId;
        const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
        sendMessage(sender, videoLink);
      }
    }
  );
}

const http = require("http");
const port = process.env.PORT || 3000;
const host = "https://project-alpha-lemon.vercel.app/";

const server = http.createServer((req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const sender = data.From;
    const message = data.Body;

    if (message.startsWith("procurar ")) {
      const query = message.slice(8);
      searchVideo(query, sender);
    }
  });

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("ok");
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
