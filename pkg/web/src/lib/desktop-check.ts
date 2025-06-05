const isDesktop = () => {
  return window.isTauri ?? false;
};

export { isDesktop };
