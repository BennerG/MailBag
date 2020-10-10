import React from "react";
import { InputBase } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const MessageView = ({ state }) => (
    <form>
        { state.currentView === "message" && 
            <InputBase defaultValue= { `ID ${state.messageID}` }
                margin="dense" disabled={ true } fullWidth={ true }
                className="messageInfoField" />
        }
        { state.currentView === "message" && <br />}
        { state.currentView === "message" && 
            <InputBase defaultValue={ state.messageDate }
                margin="dense" disabled={ true } fullWidth={ true }
                className="messageInfoField" />
        }
        { state.currentView === "message" && <br />}
        { state.currentView === "message" && 
            <TextField margin="dense" variant="outlined" disabled={ true }
                fullWidth={ true } label="From" value={ state.messageFrom }
                InputProps={{ style:  { color: "#000000" } }} />
        }
        { state.currentView === "message" && <br />}

        { state.currentView === "compose" && 
            <TextField margin="dense" variant="outlined" id="messageTo"
                fullWidth={ true } label="To" value={ state.messageTo }
                InputProps={{ style:  { color: "#000000" } }} 
                onChange={ state.fieldChangeHandler } />
        }
        { state.currentView === "compose" && <br />}
        { state.currentView === "compose" && 
            <TextField margin="dense" variant="outlined" id="messageSubject"
                fullWidth={ true } label="Subject" value={ state.messageSubject }
                disabled={ state.currentView === "message" }
                InputProps={{ style:  { color: "#000000" } }} 
                onChange={ state.fieldChangeHandler } />
        }
        
        <br />
        <TextField margin="dense" variant="outlined" id="messageBody"
            fullWidth={ true } multiline={ true } value={ state.messageBody }
            rows={ 12 } disabled={ state.currentView === "message" }
            InputProps={{ style:  { color: "#000000" } }} 
            onChange={ state.fieldChangeHandler } />
        
        { state.currentView === "compose" && <br />}
        { state.currentView === "compose" && 
            <Button variant="contained" color="primary" size="small"
                style={{ marginTop: 10 }} onClick={ state.sendMessage }>
                Send
            </Button>
        }
        { state.currentView === "message" && 
            <Button variant="contained" color="primary" size="small"
                style={{ marginTop: 10, marginRight: 10 }}
                onClick={ () => state.showComposeMessage("reply") }>
                Reply
            </Button>
        }
        { state.currentView === "message" && 
            <Button variant="contained" color="primary" size="small"
                style={{ marginTop: 10 }} onClick={ state.deleteMessage }>
                Delete
            </Button>
        }
    </form>
);

export default MessageView;