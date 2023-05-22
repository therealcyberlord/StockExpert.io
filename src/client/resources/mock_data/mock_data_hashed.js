// This file will read in the user_cred_mock_data.json file and hash the passwords
// and then write the hashed passwords to a new file called user_cred_mock_data_hashed.json
// This file is used to create the user_cred_mock_data_hashed.json file
// This file is not used in the application

import fs from 'fs';
import crypto from "crypto";


const hashNode = (val) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(crypto.createHash("sha256").update(val).digest("hex")),
      0
    )
  );

const readData = () => {
    const data = fs.readFileSync('./src/client/resources/mock_data/just_homer.json');
    return JSON.parse(data);
}

const writeData = (data) => {
    fs.writeFileSync('./src/client/resources/mock_data/just_homer_hashed.json', JSON.stringify(data));
}

const hashData = async () => {
    const data = readData();
    for (let i = 0; i < data.length; i++) {
        data[i].password = await hashNode(data[i].password);
    }
    writeData(data);
}

hashData();

