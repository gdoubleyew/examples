const React = require('react')
const ReactDOM = require('react-dom')
import RFB from './lib/rfb.js';
// import RFB from './node_modules/\@novnc/novnc/core/rfb';
// const RFB = require('./node_modules/\@novnc/novnc/core/rfb')

const elem = React.createElement

var rfb
var url = "localhost:6080"
var desktopName = "Desktop 1"

rfb = new RFB(document.getElementById('screen'), url, {});

function connectedToServer(e) {
    status("Connected to " + desktopName);
}

function disconnectedFromServer(e) {
    if (e.detail.clean) {
        status("Disconnected");
    } else {
        status("Something went wrong, connection is closed");
    }
}

function credentialsAreRequired(e) {
    const password = prompt("Password Required:");
    rfb.sendCredentials({ password: password });
}

function updateDesktopName(e) {
    desktopName = e.detail.name;
}

function status(text) {
    document.getElementById('status').textContent = text;
}

// Add listeners to important events from the RFB module
rfb.addEventListener("connect",  connectedToServer);
rfb.addEventListener("disconnect", disconnectedFromServer);
rfb.addEventListener("credentialsrequired", credentialsAreRequired);
rfb.addEventListener("desktopname", updateDesktopName);

rfb.focusOnClick = true
rfb.clipViewport = false
// rfb.showDotCursor = true

function Ctl() {
  return (
    <div>
      <button>Upload Image</button>
      <button>Download Mask</button>
      <hr />
    </div>
  )
}

const appDiv = document.getElementById('app');
ReactDOM.render(<Ctl />, appDiv);
