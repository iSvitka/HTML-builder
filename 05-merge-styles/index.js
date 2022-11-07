const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises;

const desPath = path.join(__dirname, 'project-dist', 'bundle.css');
const locPath = path.join(__dirname, 'styles');
const bundle = [];

(async () => {
    const arrFromFiles = await fsPromises.readdir(locPath, {withFileTypes: true});
    for(let file of arrFromFiles){
        if(path.extname(file.name) === ".css"){
            const fileContent = await fsPromises.readFile(path.join(locPath, file.name), 'utf-8');
            bundle.push(`${fileContent}\n`);
        }
    }

    await fsPromises.writeFile(desPath, bundle);
})();