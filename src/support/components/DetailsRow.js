import React from 'react';
import propTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const DetailsRow = ({ item: { description } }) => (
  <TextContent style={{ background: 'white' }} className="pf-v5-u-p-xl">
    <Text component={TextVariants.p}>{description}</Text>
  </TextContent>
);

DetailsRow.propTypes = {
  item: propTypes.object,
};

export default DetailsRow;
