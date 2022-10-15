import React, {useState} from 'react';
import languageEncoding from "detect-file-encoding-and-language";

function FileUploadPage(){

    let fileReader;

	const [selectedFile, setSelectedFile] = useState();
	//const [isSelected, setIsSelected] = useState(false);
    const [isEncoded, setIsEncoded] = useState();

	async function changeHandler(event) {
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