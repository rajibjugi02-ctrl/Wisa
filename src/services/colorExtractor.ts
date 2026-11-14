/**
 * Dynamically samples pixels from album art cover image to produce
 * a radiant ambient glow matching the song artwork.
 */
export function extractCoverColors(imageSrc: string): Promise<[string, string]> {
  return new Promise((resolve) => {
    if (!imageSrc) {
      return resolve(["#FF2D55", "#FF9F0A"]);
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(["#FF2D55", "#FF9F0A"]);

        ctx.drawImage(img, 0, 0, 16, 16);
        // Sample bottom half where the glow projects upwards
        const imgData = ctx.getImageData(0, 8, 16, 8).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < imgData.length; i += 4) {
          const alpha = imgData[i + 3];
          if (alpha > 128) {
            r += imgData[i];
            g += imgData[i + 1];
            b += imgData[i + 2];
            count++;
          }
        }

        if (count > 0) {
          r = Math.min(240, Math.max(30, Math.round(r / count)));
          g = Math.min(240, Math.max(30, Math.round(g / count)));
          b = Math.min(240, Math.max(30, Math.round(b / count)));

          const primaryHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          const secondaryR = Math.min(255, r + 35);
          const secondaryG = Math.max(20, g - 15);
          const secondaryB = Math.min(255, b + 45);
          const secondaryHex = `#${((1 << 24) + (secondaryR << 16) + (secondaryG << 8) + secondaryB).toString(16).slice(1)}`;

          return resolve([primaryHex, secondaryHex]);
        }
        resolve(["#FF2D55", "#FF9F0A"]);
      } catch {
        resolve(["#FF2D55", "#FF9F0A"]);
      }
    };

    img.onerror = () => {
      resolve(["#FF2D55", "#FF9F0A"]);
    };

    img.src = imageSrc;
  });
}

