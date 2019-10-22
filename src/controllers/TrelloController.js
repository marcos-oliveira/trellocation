import { getListsFromBoard } from '../trello/boards';

class TrelloController {
    getListas = () => {
        console.log('listas');
        const lists = await getListsFromBoard('538f872d42bdfee638a6b839');
        return lists;
    }
}
export default TrelloController;