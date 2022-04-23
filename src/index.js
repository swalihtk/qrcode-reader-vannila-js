class QRCodeReader {
  constructor() {
    // html elements
    this.videoElement = document.querySelector("#video");
    this.videoDiv = document.querySelector("#video-container");
    this.errorDiv = document.querySelector("#error-container");
    this.codeDetailsDiv = document.querySelector("#code-details");
    // video stream
    this.stream = null;
  }
  streamVideo() {
    if (!navigator?.mediaDevices?.getUserMedia) {
      this.errorDiv.innerHTML = `<h5>⚠️ Camera not support in this device</h5>`;
    }
    const constraints = {
      audio: false,
      video: {
        width: {min: 1280},
        height: {min: 720},
        facingMode: "environment"
      }
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        this.videoElement.srcObject = stream;
        this.barcodeScanner();
      })
      .catch((err) => {
        console.log(err);
        this.errorDiv.innerHTML = `<h5>⚠️ No Camera found in this device.</h5>`;
      });
  }

  barcodeScanner() {
    // checking device support barcode scanning
    if (!("BarcodeDetector" in window)) {
      return (this.errorDiv.innerHTML = `<h5>⚠️ BarcodeDetector not support on your device!</h5>`);
    }
    const barcodeDetector = new BarcodeDetector({
      formats: [
        "aztec",
        "code_128",
        "code_39",
        "code_93",
        "codabar",
        "data_matrix",
        "ean_13",
        "ean_8",
        "itf",
        "pdf417",
        "qr_code",
        "upc_a",
        "upc_e"
      ]
    });

    const detectBarCode = () => {
      barcodeDetector
        .detect(this.videoElement)
        .then((codes) => {
          if (codes.length < 1) {
            return;
          }
          for (const barcode of codes) {
            this.codeDetailsDiv.innerHTML = `<h3>value: <a href="${barcode.rawValue}">${barcode.rawValue}</a></h3>`;
          }
        })
        .catch((e) => {
          this.errorDiv.innerHTML = `<h5>⚠️ Some error occured.!</h5>`;
        });
    };
    setInterval(detectBarCode, 100);
  }
}

const qrCodeReader = new QRCodeReader();
// streaming camera
qrCodeReader.streamVideo();
