const handlePaste = async (e?: any) => {
  if (e.clipboardData.files[0]) {
    return e.clipboardData.files[0];
  }
  return null;
};
export { handlePaste };
