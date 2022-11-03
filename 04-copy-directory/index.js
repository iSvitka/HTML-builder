const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const baseFolder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy'); 

fs.access(copiedFolder, (err) => {
    if(err){
        fsPromises.mkdir(copiedFolder);
    }
});

async function copyMachine(pathFrom, pathTo){
    await fsPromises.rm(pathTo, {force: true, recursive: true});
    await fsPromises.mkdir(pathTo, {recursive: true});

    const arrFromFiles = await fsPromises.readdir(pathFrom, {withFileTypes:true});
    for(let file of arrFromFiles){
        const filePath = path.join(pathFrom, file.name);
        const copiedFilePath = path.join(pathTo, file.name);
        if(file.isDirectory()){
            await fsPromises.mkdir(filePath, {recursive: true});
            await copyMachine(filePath, copiedFilePath);
        } else if(file.isFile()){
            await fsPromises.copyFile(filePath, copiedFilePath);
        }
    }
}

copyMachine(baseFolder, copiedFolder);