const lodash = require('lodash');

const roles = [
  { 
    id: 0, 
    name: "Villager",
    default: true,
    alignment: "town",
  },
  {
    id: 1, 
    name: "Seer",
    populationFrequency: 0.3,
    alignment: "town",
  },
  { 
    id: 2, 
    name: "Werewolf", 
    evil: true,
    required: true,
    populationFrequency: 0.2,
    alignment: "evil",
  },
  { 
    id: 3, 
    name: "Evil Villager",
    populationFrequency: 0.3,
    alignment: "evil",
  },
  { 
    id: 4, 
    name: "Medic",
    populationFrequency: 0.3,
    alignment: "town",
  },
];

class Roles {
  static generateRoles(size) {
    const generatedRoles = [];
    const percentagePerPlayer = 1 / size;
    const requiredRoles = roles.filter(r => r.required);
    const otherRoles = roles.filter(r => !r.required && !r.default);
    const defaultRole = roles.filter(r => r.default)[0];
    
    let lastIndexVisited = 0;

    if (size < requiredRoles) throw new Error("There's more required roles than clients");

    // Setting required roles clients
    for (let role of requiredRoles) {
      let clientQuantity = Math.floor(role.populationFrequency / percentagePerPlayer);
      if (clientQuantity < 1) clientQuantity = 1;

      const startIndex = lastIndexVisited;
      
      for (lastIndexVisited; lastIndexVisited - startIndex < clientQuantity; lastIndexVisited ++) {
        generatedRoles.push(role);
      }
    }

    // Setting 
    for (let role of otherRoles) {
      let clientQuantity = Math.floor(role.populationFrequency / percentagePerPlayer);
      if (clientQuantity < 1) continue;

      const startIndex = lastIndexVisited;
      
      for (lastIndexVisited; lastIndexVisited - startIndex < clientQuantity; lastIndexVisited ++) {
        generatedRoles.push(role);
      }
    }

    // Setting default role clients
    for (let i = lastIndexVisited; i < size; i ++) {
      generatedRoles.push(defaultRole);
    }

    return lodash.shuffle(generatedRoles);
  }
}

module.exports = Roles;
