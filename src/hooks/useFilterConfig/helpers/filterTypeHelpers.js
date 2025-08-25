import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

import textType from './filterTypeHelpers/textType';
import checkboxType from './filterTypeHelpers/checkboxType';
import radioType from './filterTypeHelpers/radioType';
import groupType from './filterTypeHelpers/groupType';

export default {
  [conditionalFilterType.text]: textType,
  [conditionalFilterType.checkbox]: checkboxType,
  [conditionalFilterType.radio]: radioType,
  [conditionalFilterType.singleSelect]: radioType,
  [conditionalFilterType.group]: groupType,
};
