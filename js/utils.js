const fuelCost = 40.5;

module.exports = {

    calculateFuelForRoute: function(length, consumption){
        return length * consumption / 100.0;
    },

    calculateFuelCostForRoute: function(fuel){
        return fuel * fuelCost;
    }
}