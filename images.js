let fs = require("fs");

for (let i = 1; i < 11; i++) {
  let json = {};
  json.name = "Token #" + i;
  if (i < 4) {
    json.description = "This is the most common NFT #" + i;
    json.attributes = [];
    json.attributes[0] = {};
    json.attributes[0].trait_type = "body_color";
    json.attributes[0].value = "violet";
    json.attributes[1] = {};
    json.attributes[1].trait_type = "Rarity";
    json.attributes[1].value = "40%";
  } else if (i >= 4 && i < 7) {
    json.description = "This is rare NFT #" + i;
    json.attributes = [];
    json.attributes[0] = {};
    json.attributes[0].trait_type = "body_color";
    json.attributes[0].value = "pink";
    json.attributes[1] = {};
    json.attributes[1].trait_type = "Rarity";
    json.attributes[1].value = "30%";
  } else if (i >= 7 && i < 9) {
    json.description = "This is very rare NFT #" + i;
    json.attributes = [];
    json.attributes[0] = {};
    json.attributes[0].trait_type = "body_color";
    json.attributes[0].value = "blue";
    json.attributes[1] = {};
    json.attributes[1].trait_type = "Rarity";
    json.attributes[1].value = "20%";
  } else {
    json.description = "This is extremelly rare NFT #" + i;
    json.attributes = [];
    json.attributes[0] = {};
    json.attributes[0].trait_type = "body_color";
    json.attributes[0].value = "green";
    json.attributes[1] = {};
    json.attributes[1].trait_type = "Rarity";
    json.attributes[1].value = "10%";
  }
  json.image =
    "ipfs://bafybeid2iuyhqr4uxrtkyqw3x4n7ynhuteasbe4doywijmtb4qmk7bxsmm/" +
    i +
    ".png";

  fs.writeFileSync("" + i, JSON.stringify(json));
}
