export const UnitTypes = {
    cm: 10, // 1 cm equals 10 babylon unit
    mm: 100, // 1 mm equals to 1 babylon unit
}

export function getValueByUnitType(value, unitType){
    switch (unitType) {
        default:
        case UnitTypes.cm:
            return Math.round(value * UnitTypes.cm).toFixed(0);
        case UnitTypes.mm:
            return Math.round(value * UnitTypes.mm).toFixed(0);
    }
}