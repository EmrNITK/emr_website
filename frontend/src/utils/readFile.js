export const readFile = (file, onRead) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    onRead(reader.result);
  };

  reader.readAsDataURL(file);
};
