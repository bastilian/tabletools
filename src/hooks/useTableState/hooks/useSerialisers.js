import { useDeepCompareEffect } from 'use-deep-compare';

const useSerialisers = (
  serialiserNamespace,
  serialiser,
  serialiserInContextRef,
) => {
  useDeepCompareEffect(() => {
    if (serialiser) {
      serialiserInContextRef.current = {
        ...serialiserInContextRef.current,
        [serialiserNamespace]: serialiser,
      };
    }
  }, [serialiserInContextRef, serialiserNamespace, serialiser]);
};

export default useSerialisers;
