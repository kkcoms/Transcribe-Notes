//blobtoBase64.ts - convert blob to base64
//callback - where we want to get result
const blobToBase64 = (blob: any, callback: any) => {
  const reader = new FileReader();
  reader.onload = function () {
      if (typeof reader.result === "string") {
          const base64data = reader.result.split(",")[1];
          callback(base64data);
      }
  };
  reader.readAsDataURL(blob);
};

export { blobToBase64 };