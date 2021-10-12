const fs = require('fs');

function load_messages(){
    try {
        content_json = fs.readFileSync("./src/recados.json");
        messages_list = JSON.parse(content_json);
        return messages_list;
    } catch {
        return [];
    }
}

function write_message(nome, image_path, message_text){
    messages_list = load_messages();
    messages_list.push({nome: nome, image_path: image_path, message_text: message_text})
    content_json = JSON.stringify(messages_list, null, 4);
    fs.writeFileSync("./src/recados.json", content_json);
}

module.exports = {
    load_messages, 
    write_message
}