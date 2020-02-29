import { library } from "@fortawesome/fontawesome-svg-core";
import * as far from "@fortawesome/free-regular-svg-icons";
// Check types of IconPrefix and IconName by hovering with pressed Cmd/Ctrl - only imported icons are present.
import { IconPrefix, IconName, IconDefinition } from '@fortawesome/fontawesome-common-types';
// Comment out `import * as far from "@fortawesome/free-regular-svg-icons";` line above and see how type of IconName contains only two icons now.
import { faAddressBook } from '@fortawesome/free-regular-svg-icons/faAddressBook';

const awesomeCustomIcon: IconDefinition = {
    iconName: 'awesome-custom-icon',
    prefix: 'custom',
    icon: [512, 512, [], '', '']
}

// Custom icons can use below syntax similar to core icons, so they are not ditched by the type-checker.
declare module '@fortawesome/fontawesome-common-types' {
    interface ValidIconPrefix { 'custom': unknown; }
    interface ValidIconName { 'awesome-custom-icon': unknown; }
}

library.add(far, awesomeCustomIcon);
