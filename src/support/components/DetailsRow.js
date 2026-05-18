import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants } from '@patternfly/react-core';

const DetailsRow = ({ item: { description } }) => (
  <Content
    component={ContentVariants.p}
    style={{ background: 'white', padding: 'var(--pf-t--global--spacer--lg)' }}
  >
    {description}
  </Content>
);

DetailsRow.propTypes = {
  item: propTypes.object,
};

export default DetailsRow;
