const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const distHtmlPath = path.join(distPath, 'index.html');
const distStylePath = path.join(distPath, 'style.css');
const distAssetsPath = path.join(distPath, 'assets');

const templatePath = path.join(__dirname, 'template.html');
const stylePath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');



async function newFolder(path){
    await fsPromises.mkdir(path, {recursive: true})
}

async function deleteFolder(pathTo){
    const arrFromFiles = await fsPromises.readdir(pathTo, {withFileTypes:true});
    if(arrFromFiles != 0){
        for(let file of arrFromFiles){
            const filePath = path.join(pathTo, file.name);
            if(file.isDirectory()){
                await deleteFolder(filePath);
            } else if(file.isFile()){
                await fsPromises.rm(filePath, {force: true, recursive: true})
            }
        }
    } else {
        await fsPromises.rm(pathTo, {force: true, recursive: true})
    }
}

async function copyMachine(pathFrom, pathTo){
    await newFolder(pathTo);
    await deleteFolder(pathTo);
    await fsPromises.mkdir(pathTo, {recursive:true});

    const arrFromFiles = await fsPromises.readdir(pathFrom, {withFileTypes:true});
    for(let file of arrFromFiles){
        const filePath = path.join(pathFrom, file.name);
        const copiedFilePath = path.join(pathTo, file.name);
        if(file.isDirectory()){
            await fsPromises.mkdir(copiedFilePath, {recursive:true});
            await copyMachine(filePath, copiedFilePath);
        } else if(file.isFile()){
            await fsPromises.copyFile(filePath, copiedFilePath);
        }
    }
}

async function createHtml(pathFrom, pathTo, pathComponents){
    let template = await fsPromises.readFile(pathFrom, 'utf-8');
    const arrFromComponentsFiles = await fsPromises.readdir(pathComponents, {withFileTypes: true});
    for(let file of arrFromComponentsFiles){
        const component = await fsPromises.readFile(path.join(pathComponents, file.name), 'utf-8');
        const regExp = new RegExp(`{{${file.name.split('.')[0]}}}`, 'g');
        template = template.replace(regExp, component);
    }
        await fsPromises.writeFile(pathTo, template);
}

async function mergeStyles(pathFrom, pathTo){
    const bundle = [];
    const arrFormStlyeFiles = await fsPromises.readdir(pathFrom, {withFileTypes:true})
    for(let file of arrFormStlyeFiles){
        if(path.extname(file.name) === ".css"){
            const cssFile = await fsPromises.readFile(path.join(pathFrom, file.name), 'utf-8');
            bundle.push(`${cssFile}\n`);
        }
    }

    await fsPromises.writeFile(pathTo, bundle);
}

async function builder(){
    await newFolder(distPath);
    await copyMachine(assetsPath, distAssetsPath);
    await createHtml(templatePath, distHtmlPath, componentsPath);
    await mergeStyles(stylePath, distStylePath);
}

builder();