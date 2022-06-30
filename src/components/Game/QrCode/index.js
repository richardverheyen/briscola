import { useEffect } from "react";
import QRCode from "qrcode";
import CopyToClipboard from "./CopyToClipboard";
import "style.scss";

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
    <>
      <p>Invite other players to the game by having them scan this QR Code</p>
      <canvas id="canvas" />
      <p>or</p>
      <p>Have them join this URL:</p>
      <div style={{background: "#efefef", overflow: "scroll"}}>
        {window.location.href}
        <span>
          &nbsp;<CopyToClipboard url={window.location.href}/>
        </span>
      </div>
    </>
  );
}

export default QrCode;
