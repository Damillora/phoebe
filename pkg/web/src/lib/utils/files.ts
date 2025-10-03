export const readFileAsDataUrl: (file: File) => Promise<string> = (
  file: File,
) => {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      resolve(reader.result as string);
    });
    reader.readAsDataURL(file);
  });
};
