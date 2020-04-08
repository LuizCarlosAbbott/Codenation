const fetch = require("node-fetch");
const fs = require("fs");
const sha1 = require("js-sha1");
var request = require("request");
require("dotenv").config();

fetch(
  "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=" +
    process.env.TOKEN
)
  .then(async (response) => await response.json())
  .then((data) => {
    /* Decifrando Texto */
    const cifrado = [...data.cifrado];
    const numero_casas = data.numero_casas;

    const charCodeDecifrado = cifrado.map((char) => {
      let num = char.charCodeAt(0);
      if (char.match(/[a-z]/)) {
        return num - numero_casas;
      }
      return num;
    });

    const TextDecifrado = String.fromCharCode(...charCodeDecifrado);
    data.decifrado = TextDecifrado;

    /* Resuoma Sha1 */
    sha1(TextDecifrado);
    var hash = sha1.create();
    hash.update(TextDecifrado);
    const resumoSha1 = hash.hex();
    data.resumo_criptografico = resumoSha1;

    return data;
  })
  .then((nData) => {
    fs.writeFileSync("answer.json", JSON.stringify(nData));
  })
  .then(async () => {
    request.post(
      {
        url:
          "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=" +
          process.env.TOKEN,
        formData: {
          answer: fs.createReadStream("/home/luiz/Music/answer.json"),
        },
      },
      function (error, response, body) {
        console.log(body);
      }
    );
  });
