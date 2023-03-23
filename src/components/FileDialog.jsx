import * as React from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialogSlide(props) {

  //console.log("AlertDialogSlide");
  //console.log(props);

  if (!props.content) return null;

  if (props.content[2] > (1 * 10 ** 8)) {
    return (
      <div>
        <Dialog
          open={props.open}
          onClose={props.onClose}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle> <span className='cm-m0'>{"Uploaded File Too Big"}</span></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <p>
                <span className='cm-m1'>Please upload a file smaller than 100 MB</span>
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} color="primary">Ok</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
    return (
      <div>
        <Dialog
          open={props.open}
          onClose={props.onClose}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle> <span className='cm-m0'>{"Uploaded File Data"}</span></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <p>
                <span className='cm-m0'>File name:</span> 
                <span className='cm-m1'>{props.content[0]}</span>
              </p>
              <p> 
                <span className='cm-m0'>File type: </span> 
                <span className='cm-m1'>{props.content[1]}</span> 
              </p>
              <p> 
                <span className='cm-m0'>File size: </span> 
                <span className='cm-m1'>{props.content[2]} bytes</span> 
              </p>
              <p> 
                <span className='cm-m0'>File encoding: </span> 
                <span className='cm-m1'>{props.content[3]}</span> 
              </p>
              <p> 
                <span className='cm-m0'>File content preview: </span> 
                <span className='cm-m1'>{props.content[4]}</span> 
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} color="primary">Disagree</Button>
            <Button onClick={props.handleAgree} color="primary">Agree</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}