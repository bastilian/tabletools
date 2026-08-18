import deepmerge from 'deepmerge';

const getId = (item) => {
  const key = item.key || item.label || item.title || item;
  return typeof key === 'string' ? key.replaceAll(' ', '-').toLowerCase() : key;
};

const findDefault = (defaults, ext) =>
  defaults.find((def) => getId(def) === getId(ext));

const selectByKeyAndMerge = (defaults, extension) =>
  extension
    .map((ext) => {
      const def = findDefault(defaults, ext);

      if (typeof ext === 'string') {
        return def;
      } else if (typeof ext === 'object') {
        return deepmerge(def, ext);
      }
    })
    .filter((v) => !!v);

export const compileWithDefaults = (defaults, extension) => {
  if (typeof extension === 'undefined') {
    return defaults;
  } else if (Array.isArray(extension)) {
    return selectByKeyAndMerge(defaults, extension);
  }
};

export const collectDefaultsAndProps = ({
  defaults,
  props: parentProps,
  ...props
}) => {
  if (parentProps) {
    const { props: allParentProps, defaults: parentDefaults } =
      collectDefaultsAndProps(parentProps);

    return {
      props: deepmerge(allParentProps, props),
      defaults: deepmerge(parentDefaults, defaults),
    };
  } else {
    return {
      defaults,
      props,
    };
  }
};
