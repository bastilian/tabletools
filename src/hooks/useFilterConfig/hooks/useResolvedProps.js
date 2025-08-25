import { useRef, useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

const resolveObjectsProps = async (objects, propsToResolve) => {
  const resolvedObjects = [];

  for (const object of objects) {
    let newObject = { ...object };

    for (const prop of propsToResolve) {
      if (typeof object[prop] === 'function') {
        const resolvedProp = await object[prop]();
        if (
          Array.isArray(resolvedProp[0]) &&
          typeof resolvedProp[1] === 'number'
        ) {
          newObject[prop] = resolvedProp[0];
        } else {
          newObject[prop] = resolvedProp;
        }
      }
    }

    resolvedObjects.push(newObject);
  }

  return resolvedObjects;
};

// TODO this hook may be useful elsewhere as well, move it higher up and/or into som utils hook folder
const useResolvedProps = (objects, propsToResolve) => {
  const resolving = useRef(false);
  const [resolvedObjects, setResolvedObjects] = useState();

  useDeepCompareEffect(() => {
    const resolveObjects = async (objects, propsToResolve) => {
      resolving.current = true;
      const newResolvedObjects = await resolveObjectsProps(
        objects,
        propsToResolve,
      );
      resolving.current = false;
      setResolvedObjects(newResolvedObjects);
    };

    if (!resolvedObjects && !resolving.current) {
      resolveObjects(objects, propsToResolve);
    }
  }, [objects, propsToResolve, resolvedObjects]);

  return resolvedObjects;
};

export default useResolvedProps;
