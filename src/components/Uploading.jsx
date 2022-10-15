import React, {useState} from 'react';
import languageEncoding from "detect-file-encoding-and-language";

function FileUploadPage(){

    let fileReader;

	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
        languageEncoding(selectedFile).then(
            (fileInfo) => console.log(Object.values(fileInfo)[0])
            );

    };

	const handleSubmission = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = changeHandler;
        fileReader.readAsText(file);        
	};

	return(
        <div>
        <input type="file" name="file" onChange={changeHandler} />
        {isSelected ? (
    
            <div>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size: {selectedFile.size} Bytes</p>
                <p>Encoding: {selectedFile.info} </p>       
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