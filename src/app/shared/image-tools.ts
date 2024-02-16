//Working
export function cropImage(sourceImageUrl: string, cropStartX: number, cropStartY: number, cropWidth: number, cropHeight: number) {
  return new Promise((resolve, reject) => {
    // create an image object
    let img = new Image();
    img.onload = function () {
      // create a canvas element
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;

      if (!canvas)
        return reject(new Error('Failed to load image'));

      // canvas.width = cropWidth;
      // canvas.height = cropHeight;

      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (!ctx)
        return reject(new Error('Failed to load image'));

      // ctx.drawImage(img, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      ctx.drawImage(img, 0, 0);

      // ctx.globalAlpha = 0.5;
      // ctx.beginPath();
      // ctx.rect(925.33-cropStartX,615.66-cropStartY,145.66,58);
      // ctx.fillStyle = 'yellow';
      // ctx.fill();
      //ctx.drawImage(img, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      //ctx.drawImage(img,400,100,400,200,50,50,400,200);



      // convert the canvas to a data URL
      resolve(canvas.toDataURL());
    };
    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };
    img.src = sourceImageUrl;
  });
}

export function cropImage2(sourceImageUrl: string, cropStartX: number, cropStartY: number, cropWidth: number, cropHeight: number) : Promise<string> {
  return new Promise((resolve, reject) => {
    // create an image object
    let img = new Image();
    img.onload = function () {
      // create a canvas element
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;

      if (!canvas)
        return reject(new Error('Failed to load image'));

      // canvas.width = cropWidth;
      // canvas.height = cropHeight;

      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (!ctx)
        return reject(new Error('Failed to load image'));

      ctx.drawImage(img, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.rect(925.33 - cropStartX, 615.66 - cropStartY, 145.66, 58);
      ctx.fillStyle = 'yellow';
      ctx.fill();
      //ctx.drawImage(img, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      //ctx.drawImage(img,400,100,400,200,50,50,400,200);



      // convert the canvas to a data URL
      resolve(canvas.toDataURL());
    };
    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };
    img.src = sourceImageUrl;
  });
}

export function clipImage(sourceImageUrl: string, cropStartX: number, cropStartY: number, cropWidth: number, cropHeight: number) {
  return new Promise((resolve, reject) => {
    // create an image object
    let img = new Image();
    img.onload = function () {
      // create a canvas element
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;

      if (!canvas)
        return reject(new Error('Failed to load image'));

      // canvas.width = cropWidth;
      // canvas.height = cropHeight;

      canvas.width = img.width;
      canvas.height = cropHeight;
      let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (!ctx)
        return reject(new Error('Failed to load image'));
      ctx.save();
      ctx.rect(cropStartX, cropStartY, cropWidth, cropHeight);
      ctx.stroke();
      ctx.clip();
      // ctx.drawImage(img, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      ctx.drawImage(img, 0, 0);



      // ctx.globalAlpha = 0.5;
      // ctx.beginPath();
      // ctx.rect(925.33-cropStartX,615.66-cropStartY,145.66,58);
      // ctx.fillStyle = 'yellow';
      // ctx.fill();
      //ctx.drawImage(img, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      //ctx.drawImage(img,400,100,400,200,50,50,400,200);



      // convert the canvas to a data URL
      resolve(canvas.toDataURL());
    };
    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };
    img.src = sourceImageUrl;
  });
}
