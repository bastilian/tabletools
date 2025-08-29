import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

import textType from './textType';
import checkboxType from './checkboxType';
import radioType from './radioType';
import groupType from './groupType';

export default {
  [conditionalFilterType.text]: textType,
  [conditionalFilterType.checkbox]: checkboxType,
  [conditionalFilterType.radio]: radioType,
  [conditionalFilterType.singleSelect]: radioType,
  [conditionalFilterType.group]: groupType,
};
