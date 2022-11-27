import React, { useState } from 'react';
import languageEncoding from "detect-file-encoding-and-language";
import AlertDialogSlide from './FileDialog';

export default function FileUploadingPrev() {

  const [file, setFile] = useState(null);
  const [isEncoded, setIsEncoded] = useState(null);
  const [isArr, setIsArr] = useState(null);
  const [content, setContent] = useState(null);

  async function getEncoding(file) {
    try {
      return await languageEncoding(file);
    } catch (err) {
      alert(err);
    }
  }
   
  const showFile = async (e) => {
    const uncodedFile = e.target.files[0];
    console.log(typeof(uncodedFile));
    setFile(uncodedFile);
    const encoding = await getEncoding(uncodedFile);
    setIsEncoded(encoding.encoding);
    const reader = new FileReader()
    reader.onload = async (e) => { 
      try {
        setIsArr(e.target.result.slice(0, 500));
        setContent([file.name, file.type, file.size, isEncoded, isArr]);
      } catch (error) {
        alert(error)
      }
    };
    reader.readAsText(uncodedFile)
  }

  return (
    <div>
      <input type="file" accept='text/*' onChange={showFile} />

      {content ? <AlertDialogSlide content={content} /> : (
        <p>Upload a file</p>
      )}
      
    </div>
  )
}
