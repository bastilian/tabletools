import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';

const DarkMode = ({ children }) => {
  const enableDarkMode = useDarkMode();

  useEffect(() => {
    document
      .getElementsByTagName('html')[0]
      .setAttribute('class', enableDarkMode ? 'pf-v6-theme-dark' : '');

    return () => {
      document.getElementsByTagName('html')[0].setAttribute('class', '');
    };
  }, [enableDarkMode]);

  return children;
};

export default DarkMode;
