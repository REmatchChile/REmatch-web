import * as React from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialogSlide(props) {

  //console.log("AlertDialogSlide");
  console.log(props);

  if (!props.content) return null;

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Uploaded File Data"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p>File name: {props.content[0]}</p>
            <p>File type: {props.content[1]}</p>
            <p>File size: {props.content[2]} bytes</p>
            <p>File encoding: {props.content[3]}</p>
            <p>File content preview: {props.content[4]}</p>
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