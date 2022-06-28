import { useEffect, useState } from "react";
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
    <>
      <p>Invite other players to the game by having them scan this QR Code</p>
      <canvas id="canvas" width="200" height="200" />
      <p>or</p>
      <p>Have them join this URL:</p>
      <div style={{background: "#efefef"}}>
        {window.location.href}
        <span>
          &nbsp;<CopyToClipboard url={window.location.href}/>
        </span>
      </div>
    </>
  );
}

export default QrCode;
