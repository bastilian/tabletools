import { useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';

const resolveObjectsProps = async (objects, propsToResolve) => {
  const resolvedObjects = [];

  for (const object of objects) {
    let newObject = { ...object };

    for (const prop of propsToResolve) {
      // TODO Allow to pass function arguments when resolving props
      if (typeof object[prop] === 'function') {
        newObject[prop] = await object[prop]();
      }
    }

    resolvedObjects.push(newObject);
  }

  return resolvedObjects;
};

// TODO this hook may be useful elsewhere as well, move it higher up and/or into som utils hook folder
const useResolvedProps = (objects, propsToResolve) => {
  const [resolvedObjects, setResolvedObjects] = useState([]);

  useDeepCompareEffect(() => {
    const resolveObjects = async (objects, propsToResolve) => {
      const newResolvedObjects = await resolveObjectsProps(
        objects,
        propsToResolve
      );

      setResolvedObjects(newResolvedObjects);
    };

    resolveObjects(objects, propsToResolve);
  }, [objects, propsToResolve]);

  return resolvedObjects;
};

export default useResolvedProps;
