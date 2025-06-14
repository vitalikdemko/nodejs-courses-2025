
import { handleAdd, handleList, handleDelete, handleUpdate, handleDone, handleStats } from '../controllers/habit.controller.js';

export function routeCommand(args) {
  const command = args[0];

  switch (command) {
    case 'add': {
        handleAdd(args);
        break;
      }
    case 'list':{
      handleList();
      break;
    }
    case 'done':{
      handleDone(args);
      break;
    }
    case 'delete': {
      handleDelete(args);
      break;
    }
    case 'update':{
      handleUpdate(args);
      break;
    }
    case 'stats':{
      handleStats();
      break;
    }
    default:{
      console.log('Unknown command. Use add | list | done | delete | update | stats');
    }
  }
}
