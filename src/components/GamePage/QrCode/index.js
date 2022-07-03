import "./style.scss";
import { useEffect } from "react";
import QRCode from "qrcode";
import CopyToClipboard from "./CopyToClipboard";

function QrCode() {
  useEffect(() => {
    showQR();
  }, []);

  function showQR() {
    const canvas = document.querySelector("canvas");
    QRCode.toCanvas(canvas, window.location.href, (error) => {
      if (error) console.error(error);
    });
  }

  return (
    <div id="QrCode">
      <h2>Invite another player to the game<br/> by having them scan this QR Code</h2>
      <canvas id="canvas" />
      <p>or</p>
      <p>Have them join this URL:</p>
      <div className="url">
        {window.location.href}
        <span>
          &nbsp;<CopyToClipboard url={window.location.href}/>
        </span>
      </div>
    </div>
  );
}

export default QrCode;
