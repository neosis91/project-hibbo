/**
 * Created by Fakebounce on 13/11/2016.
 */
import { Record } from '../transit';

const Dungeon = Record({
    "id": "",
    "name" : "",
    "worldmap" : "",
    "description" : "",
    "lock" : false,
}, 'dungeon');

export default Dungeon;
