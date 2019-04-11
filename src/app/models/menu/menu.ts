import { IProfile } from '../../models/users/profile';
import { ISubmenu } from '../../models/menu/submenu';
export interface IMenu {
    ide?: string;
    control?: string;
    name?: string;
    labelledby?: string;
    background?: string;
    target?: string;
    profile?: IProfile[];
    sumenu?: ISubmenu[];
}
