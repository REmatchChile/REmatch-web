import React, { useState } from 'react';
import languageEncoding from "detect-file-encoding-and-language";
import AlertDialogSlide from './FileDialog';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Publish from '@material-ui/icons/Publish';

export default function FileUploadingPrev(props) {
  const [preFile, setPreFile] = useState(null);
  const [content, setContent] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
      handleClose();
      props.preloadedFile(preFile);
  };

  async function getEncoding(file) { //SOLO UTF-8
    try {
      return await languageEncoding(file);
    } catch (err) {
      alert(err);
    }
  }
  
   
  const showFile = async (e) => {
    // 1. Obtener archivo y setearlo en file
    const file = e.target.files[0];
    if (!file) return;
    // 2. Obtener encoding y setearlo
    const encoding = await getEncoding(file);
    // 3. Leer N caracteres del archivo (500) y setear arr y content
    const N_CHARS = 500;
    const fileHead = await file.slice(0, N_CHARS).text();

    setContent([file.name,
                file.type,
                file.size,
                encoding.encoding,
                fileHead]); //encontrar forma de subir otro archivo
    setPreFile(file);
    setOpen(true);
  }

  return (
    <div>
      <input type="file" accept='text/*' onChange={showFile} />

      {content ? <AlertDialogSlide 
                  content={content}
                  open={open}
                  onClose={handleClose}
                  handleAgree={handleAgree}
                  preloadedFile={props.preloadedFile}
                  /> : (
        null
      )}
      
    </div>
  )
}
