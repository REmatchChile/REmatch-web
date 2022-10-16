import React, {useState} from 'react';

//import * as fs from 'fs';

import languageEncoding from "detect-file-encoding-and-language";

function FileUploadPage(){

    let fileReader;

	const [selectedFile, setSelectedFile] = useState();
	//const [isSelected, setIsSelected] = useState(false);
    const [isEncoded, setIsEncoded] = useState();
    const [isArr, setIsArr] = useState([]);

	async function changeHandler(event) {
        let fileReader = new FileReader();
        event.preventDefault();
		setSelectedFile(event.target.files[0]);
		//setIsSelected(true);
        /*languageEncoding(selectedFile).then(
            (fileInfo) => 
            setIsEncoded(Object.values(fileInfo)[0]));*/
        try { 
            let selFi = await languageEncoding(selectedFile);
            let enc =  await Object.values(selFi)[0];
            setIsEncoded(enc);
            console.log(enc);
        } catch (err) {
            alert(err);
        }
        /*let fileContent = await fs.readFileSync(selectedFile);
        console.log(fileContent);*/

        fileReader.onload = async (event) => {
            let fileContent = await fileReader.result;
            //console.log(fileContent); //copilot me lo sugirió, pero no retorna nada
            console.log("aqui");
            //console.log(typeof(fileReader.result)); //esto tampoco
            let arr = fileContent.split("\n");
            console.log(arr);
            setIsArr(arr.slice(0, 5));
        }
        fileReader.readAsText(selectedFile);
        //console.log(arr); //esto tampoco retorna nada
        /*setIsArr(fileReader.result);
        console.log("veremos si resulta");
        console.log(isArr);*/
    };

	const handleSubmission = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = changeHandler;
        fileReader.readAsText(file);        
	};

	return(
        <div>
        <input type="file" accept=".csv, .txt, .md, .text, .plain" name="file" onChange={changeHandler} />
        {isEncoded ? (
    
            <div>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size: {selectedFile.size} Bytes</p>
                <p>Encoding: {isEncoded} </p>
                <p>First 5 lines: </p>
                <p>    {isArr[0]}  </p>
                <p>    {isArr[1]}  </p>
                <p>    {isArr[2]}  </p>
                <p>    {isArr[3]}  </p>
                <p>    {isArr[4]}  </p>
            </div>
        ) : (
            <p>Select a file to show details</p>
        )}
        <div>
            <button onClick={handleSubmission}>Submit</button>
        </div>
    </div>
	)
}

export default FileUploadPage;